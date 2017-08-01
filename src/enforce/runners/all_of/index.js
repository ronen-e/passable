// @flow
import run from '../run';

export default function allOf(value: any, tests: Object, rules: Rules): boolean {

    const testsCount = Object.keys(tests).length;
    let successCount = 0;

    if (testsCount === 0) {
        return false;
    }

    for (const key in tests) {
        const success = run(value, key, tests, rules);

        if (success === true) {
            successCount++;
        }
    }

    return successCount === testsCount;
}