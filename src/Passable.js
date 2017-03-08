import Enforce from './enforce';

const WARN = 'warn',
    FAIL = 'fail',
    FUNCTION = 'function';

/**
 * Runs a group of validation tests
 *
 * @param  {String}   name     - A name for the group of tests which is being run
 * @param  {Array}    specific - (optional) An array of names specific passes you wish to run. If passed, others will be excluded.
 * @param  {function} passes   - A function that contains the validation logic
 * @param  {Object}   custom   - (optional) Custom rules, extensions for the predefined rules
 * @return validation result
 *
 */
function Passable(name, ...args) {

    const {
        specific, passes, custom
    } = passableArgs(args);

    let hasValidationErrors = false,
        hasValidationWarnings = false,
        failCount = 0,
        warnCount = 0,
        testCount = 0,
        success;

    const testsPerformed = {},
        validationErrors = {},
        validationWarnings = {},
        skipped = [];

    /**
     * Runs a single test within the validation process
     *
     * @param  {String}   dataName  - A name for the test (unit) which is being run
     * @param  {String}   statement - A description for the test which is being run
     * @param  {String}   severity  - (optional) warn instead of fail (expects 'warn')
     * @param  {Function} callback  - The specific test's validation logic
     * @return {Boolean}  whether the unit is valid or not
     *
     * @example pass('UserName', 'Must be longer than 5 chars', () => {...});
     */
    const pass = (dataName, statement, ...args) => {

        if (specific.length && specific.indexOf(dataName) === -1) {
            skipped.push(dataName);
            return;
        }

        // callback is always the last argument
        const callback = args.slice(-1)[0];

        let severity = FAIL,
            isValid;

        if (typeof callback === FUNCTION) {
            // run the validation logic
            try {
                isValid = callback();
            } catch (e) {
                isValid = false;
            }
        }

        if (typeof args[0] === 'string') {
            // warn rather than fail
            severity = args[0] === WARN ? WARN : FAIL;
        }

        if (!testsPerformed.hasOwnProperty(dataName)) {
            testsPerformed[dataName] = {
                testCount: 0,
                failCount: 0,
                warnCount: 0
            };
        }

        if (!isValid) {
            // on failure/error, bump up the counters
            severity === FAIL ? onError(dataName, statement) : onWarn(dataName, statement);
        }

        // bump overall counters
        testsPerformed[dataName].testCount++;
        testCount++;

        return isValid;
    };

    const onError = (dataName, statement) => {
        hasValidationErrors = true;
        validationErrors[dataName] = validationErrors[dataName] || [];
        validationErrors[dataName].push(statement);
        failCount++;
        testsPerformed[dataName].failCount++;
    };

    const onWarn = (dataName, statement) => {
        hasValidationWarnings = true;
        validationWarnings[dataName] = validationWarnings[dataName] || [];
        validationWarnings[dataName].push(statement);
        warnCount++;
        testsPerformed[dataName].warnCount++;
    };

    const generateResultObject = () => {
        const result = {
            name,
            hasValidationErrors,
            hasValidationWarnings,
            testsPerformed,
            validationErrors,
            validationWarnings,
            failCount,
            warnCount,
            testCount,
            skipped
        };

        if (typeof success !== 'undefined') {
            result.success = success;
        }

        return result;
    };

    if (typeof passes === FUNCTION) {
        // register all the tests
        const enforce = Enforce(custom);

        // run all units in the group
        passes(pass, enforce);
    }

    return generateResultObject();
};

module.exports = Passable;

// helpers

function passableArgs(args) {

    let passes,
        specific,
        custom;

    if (args.length === 1) {
        passes = args[0];
    } else if (args.length === 3) {
        specific = args[0];
        passes = args[1];
        custom = args[2];
    } else if (args.length === 2) {
        if (typeof args[1] === FUNCTION) {
            specific = args[0];
            passes = args[1];
        } else {
            passes = args[0];
            custom = args[1];
        }
    }

    specific = specific || [];
    custom = custom || {};

    return {
        passes, specific, custom
    }
};