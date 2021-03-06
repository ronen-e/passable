# Size | smallerThanOrEquals

## Description
Returns true if a given value is smaller than or equals another value. The values do not have to be of the same type

## Arguments
* `value`: the value which you would like to test. can be:
* `target` the value which you would like your initial object to be tested against

Both arguments can be of the following types:
* object: checks against count of keys
* array: checks against length
* number: checks the value of the number
* string: checks against length

## Response
The smallerThanOrEquals rule returns a boolean. `true` for smaller or equal values

## usage examples:

```js
enforce([]).smallerThanOrEquals(1);
// true
```

```js
enforce(5).smallerThanOrEquals(6);
// true
```

```js
enforce({1:1, 2:2, 3:3}).smallerThanOrEquals([1,2,3]);
// true
```

```js
enforce('hell').smallerThanOrEquals([1,2,3,4]);
// true
```

```js
enforce([1]).smallerThanOrEquals(1);
// true
```

```js
enforce({1:1, 2:2, 3:3}).smallerThanOrEquals([1, 2]);
// false
```

```js
enforce('yo').smallerThanOrEquals([]);
// false
```

```js
enforce('0').smallerThanOrEquals(0);
// false
```