Our coding conventions follow [Felix's Node.js Style Guide](http://nodeguide.com/style.html), with a few modifications. Read it. Learn it. Then read these:

NOTE: If any conventions are found to be non-optimal in the future, they can be changed in whole or in part with a 2/3rds community vote (that's 2/3rds of the people that vote, not 2/3rds of the community. So vote!).

### Indentation

Indent using 4 spaces. Tabs should not be used.

### Conditional statements

It is not required that you put non-trivial conditional statements into variables, but you should use good judgement. A variable might give the statement more meaning, or it may distract from the purpose of the code. If you're in a class, perhaps putting the logic for the conditional statement into a method would read better.

### Function length

There is no requirement to keep functions under 10 lines. Functions should be as long as they need to be. In general, smaller functions are more desirable as they are indicative of good separation of concerns and aid reuse, but there is no maximum length.

### Return statements

Yes, you should avoid nesting if at all possible. Return early and often.

There is no requirement to package return statements into a variable, however. For example, this method

```javascript
function isPercentage(value) {
    var isInRange = (value >= 0 && value <= 100);
    return isInRange;
}
```

should be written as

```javascript
function isPercentage(value) {
    return (value >= 0) && (value <= 100);
}
```

If you miss the extra information you get with the variable name "isInRange", that's an indicator that you need another function:

```javascript
function isInRange(min, max, value) {
   return (value >= min) && (value <= max);
}

function isPercentage(value) {
    return isInRange(0, 100, value);
}
```

or another class:

```javascript
function Range(min, max) {
    this.min = min;
    this.max = max;
}

Range.prototype.contains = function (value) {
    return (value >= this.min) && (value <= this.max);
};

function isPercentage(value) {
    return (new Range(0, 100)).contains(value);
}
```

### Named closures

Named closures are a good idea, but not required. Once again, use good judgement. If you don't name a closure where it makes sense to do so, someone may point it out during a review of your pull request.

### Nested Closures

Disregard the section on nested closures. While they may not always be optimal, and should be kept to a minimum, feel free to use them when it makes sense.