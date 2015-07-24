## How to write a unit test

Unit tests should be placed in the `test` subdirectory of either the `client` or `server` directory. The name should be the same as the file they test.

See `client/tests/chest.js` for an example.

### Libraries

[Mocha](http://visionmedia.github.io/mocha/) is used as the unit testing framework.  
[Should.js](https://github.com/visionmedia/should.js/) is used as the assertion framework.  
[Sinon.js](http://sinonjs.org/) is used for spies, stubs, and mocks.  

Please use the BDD style when writing Mocha tests.

### Writing Tests

The following lines need to be added to the top of any unit test: 

    load_boilerplate = require('../boilerplate.js');
    eval(load_boilerplate());

Explanation:

`load_boilerplate = require('../boilerplate.js');`  
This line loads the load_boilerplate function, which returns the text from shared/js/test_bootstrap.js.

`eval(load_boilerplate())`  
This line executes the load_boilerplate function, and runs the returned string through `eval`. Since the eval'd text affects the context it is executed in, it has to be eval'd and not require'd.

In addition, the following code needs to be added underneath the `describe` statement:

    var <ClassName>;
    var self = this;

    beforeEach(function(done) {

        requirejs(['<FileName>'], function(_Module) {
            <ClassName> = _Module;
            self.<filename> = new <ClassName>(1);
            done();
        }); 
    }); 

Replace `<ClassName>` with the class that you are testing, and <FileName> with the filename you are testing, without the `.js` extension

### Running Tests

To run the entire test suite, run `make test` from the root of the project. This will run both the client and server tests.  

To watch a set of tests for changes, run `mocha -w` from the `client` or `server` directory.