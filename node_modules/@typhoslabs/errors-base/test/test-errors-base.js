"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Errors = require('../index.js')();
var ErrorsExt = require('../index.js')();

require('@orchardcorset/errors-inherits')(ErrorsExt);
require('@orchardcorset/errors-capture-stack')(ErrorsExt);

describe('Errors', function(){
    describe('(call)', function(){
        it('should just return by default', function(){
            expect(Errors()).to.equal(undefined);
        });
        it('should call a subfunction if a module wants to override the base functionality', function(){
            var Errors = require('../index.js')();
            var called = 0;
            Errors.setFn(function(){
                return ++called;
            });
            expect(Errors()).to.equal(1);
            expect(called).to.equal(1);
        });
    });
    describe('#extend()', function(){
        it('should add all needed values to the class constructor and prototye', function(){
            var TestError = Errors.extend('TestError', 'default_message', 123);
            
            expect(TestError._init).to.be.a('function');
            expect(TestError.prototype.name).to.equal('TestError');
            expect(TestError.prototype.status_code).to.equal(123);
            expect(TestError.prototype.safe_message).to.equal('default_message');
            expect(TestError.extend).to.be.a('function');
            
            var err = TestError('message', null, { additional: true });
            
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('default_message');
            expect(err.status_code).to.equal(123);
            expect(err.name).to.equal('TestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('TestError: message');
        });
        
        it('should use inheritance if added', function(){
            var ErrorsInheritance = require('../index.js')();
            require('@orchardcorset/errors-inherits')(ErrorsInheritance);
            
            var TestError = ErrorsInheritance.extend('TestError', 'default_message', 123);
            
            expect(TestError._init).to.be.a('function');
            expect(TestError.prototype.name).to.equal('TestError');
            expect(TestError.prototype.status_code).to.equal(123);
            expect(TestError.prototype.safe_message).to.equal('default_message');
            expect(TestError.extend).to.be.a('function');
            
            var err = TestError('message', null, { additional: true });
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(TestError);
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('default_message');
            expect(err.status_code).to.equal(123);
            expect(err.name).to.equal('TestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('TestError: message');
        });
        
        it('should capture stack trace if added', function(){
            var ErrorsStack = require('../index.js')();
            require('@orchardcorset/errors-capture-stack')(ErrorsStack);
            
            var TestError = ErrorsStack.extend('TestError', 'default_message', 123);
            
            expect(TestError._init).to.be.a('function');
            expect(TestError.prototype.name).to.equal('TestError');
            expect(TestError.prototype.status_code).to.equal(123);
            expect(TestError.prototype.safe_message).to.equal('default_message');
            expect(TestError.extend).to.be.a('function');
            
            var err = TestError('message', null, { additional: true });
            
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('default_message');
            expect(err.status_code).to.equal(123);
            expect(err.name).to.equal('TestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('TestError: message');
            expect(err.stack).to.match(/^TestError\: message.*(\r\n|\r|\n).*test-errors-base.js/);
        });
        
        it('should work with a custom constructor', function(){
            function TestError(message, error, additional){
                return TestError._init(this, message, error, additional);
            }
            
            Errors.extend(TestError, 'TestError', 'default_message');
            
            expect(TestError._init).to.be.a('function');
            expect(TestError.prototype.name).to.equal('TestError');
            expect(TestError.prototype.status_code).to.equal(500);
            expect(TestError.prototype.safe_message).to.equal('default_message');
            expect(TestError.extend).to.be.a('function');
            
            var err = TestError('message', null, { additional: true });
            
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('default_message');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('TestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('TestError: message');
        });
        
        it('should work with a custom constructor with inheritance and stack trace', function(){
            function TestError(message, error, additional){
                return TestError._init(this, message, error, additional);
            }
            
            ErrorsExt.extend(TestError, 'TestError', 'default_message');
            
            expect(TestError._init).to.be.a('function');
            expect(TestError.prototype.name).to.equal('TestError');
            expect(TestError.prototype.status_code).to.equal(500);
            expect(TestError.prototype.safe_message).to.equal('default_message');
            expect(TestError.extend).to.be.a('function');
            
            var err = TestError('message', null, { additional: true });
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(TestError);
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('default_message');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('TestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('TestError: message');
            expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        });
        
        it('should set generic if passed', function(){
            var TestError = Errors.extend('TestError', 'default_message', 123);
            
            var err = TestError("test error!", null, { addl:true }, 'test', true);
            expect(err.generic).to.equal(true);
            
            err = TestError("test error!", null, { addl:true }, true);
            expect(err.generic).to.equal(true);
            
            err = TestError("test error!", null, null, true);
            expect(err.generic).to.equal(true);
        });
        
        it('should be able to extend a custom error', function(){
            var TestError = Errors.extend('TestError', 'default_message', 123);
            
            var ExtendedTestError = TestError.extend('ExtendedTestError', 'extended_default_message', 321);
            
            expect(ExtendedTestError._init).to.be.a('function');
            expect(ExtendedTestError.prototype.name).to.equal('ExtendedTestError');
            expect(ExtendedTestError.prototype.status_code).to.equal(321);
            expect(ExtendedTestError.prototype.safe_message).to.equal('extended_default_message');
            expect(ExtendedTestError.extend).to.be.a('function');
            
            var err = ExtendedTestError('message', null, { additional: true });
            
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('extended_default_message');
            expect(err.status_code).to.equal(321);
            expect(err.name).to.equal('ExtendedTestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('ExtendedTestError: message');
        });
        
        it('should be able to extend a custom error with inheritance and stack trace', function(){
            var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
            
            var ExtendedTestError = TestError.extend('ExtendedTestError', 'extended_default_message', 321);
            
            expect(ExtendedTestError._init).to.be.a('function');
            expect(ExtendedTestError.prototype.name).to.equal('ExtendedTestError');
            expect(ExtendedTestError.prototype.status_code).to.equal(321);
            expect(ExtendedTestError.prototype.safe_message).to.equal('extended_default_message');
            expect(ExtendedTestError.extend).to.be.a('function');
            
            var err = ExtendedTestError('message', null, { additional: true });
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(TestError);
            expect(err).to.be.instanceof(ExtendedTestError);
            expect(err.message).to.equal('message');
            expect(err.safe_message).to.equal('extended_default_message');
            expect(err.status_code).to.equal(321);
            expect(err.name).to.equal('ExtendedTestError');
            expect(err.additional).to.deep.equal({ additional:true });
            expect('' + err).to.equal('ExtendedTestError: message');
            expect(err.stack).to.match(/^ExtendedTestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        });
    });
    
    describe('#add()', function(){
        it('should add an error to another err', function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            err1 = Errors.add(err1, err2);
            
            expect(err1).to.have.key('errors');
            expect(err1.errors).to.deep.equal([ err2 ]);
        });
        
        it('should add an error as a field', function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            err1 = Errors.add(err1, 'test', err2);
            
            expect(err1).to.have.key('fields');
            expect(err1.fields).to.deep.equal({ test: err2 });
        });
        
        it('should use "field" on an error if no field was passed', function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            err2.field = 'test';
            
            err1 = Errors.add(err1, err2);
            
            expect(err1).to.have.key('fields');
            expect(err1.fields).to.deep.equal({ test: err2 });
        });
        
        it('should not use "field" on an error if field was passed but falsy', function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            err2.field = 'test';
            
            err1 = Errors.add(err1, undefined, err2);
            
            expect(err1).to.not.have.key('fields');
            expect(err1).to.have.key('errors');
            expect(err1.errors).to.deep.equal([ err2 ]);
        });
        
        it("should throw if base error is not an object", function(){
            var err;
            var err1 = new Error('Err!');
            
            try {
                Errors.add('bad', err1);
            } catch(e){
                err = e;
            }
            
            expect(err).to.be.an.instanceof(Error);
            expect(err).to.have.key('errors');
            expect(err.errors).to.deep.equal([err1]);
        });
        
        it("should be able to add multiple errors to the same base error", function(){
            var test_err1 = new Error('test error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            
            test_err1 = Errors.add(test_err1, 'test', err2);
            test_err1 = Errors.add(test_err1, 'test2', err3);
            
            expect(test_err1).to.have.key('fields');
            expect(test_err1.fields).to.deep.equal({ test: err2, test2:err3 });
            
            var test_err2 = new Error('test error 2');
            
            test_err2 = Errors.add(test_err2, err2);
            test_err2 = Errors.add(test_err2, err3);
            
            expect(test_err2).to.have.key('errors');
            expect(test_err2.errors).to.deep.equal([ err2, err3 ]);
        });
        
        it("it should add the errors of the error being added to the parent", function(){
            var err1 = new Error('test error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            
            err1 = Errors.add(err1, err2);
            err1 = Errors.add(err1, err3);
            
            expect(err1).to.have.key('errors');
            expect(err1.errors).to.deep.equal([ err2, err3 ]);
            
            var test_err = new Error('test error 2');
            
            test_err = Errors.add(test_err, err1);
            
            expect(test_err).to.have.key('errors');
            expect(test_err.errors).to.deep.equal([ err1, err2, err3 ]);
        });
        
        it("it should add the errors of the error being added to the parent field", function(){
            var err1 = new Error('test error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            
            err1 = Errors.add(err1, err2);
            err1 = Errors.add(err1, err3);
            
            expect(err1).to.have.key('errors');
            expect(err1.errors).to.deep.equal([ err2, err3 ]);
            
            var test_err = new Error('test error 2');
            
            test_err = Errors.add(test_err, 'test', err1);
            
            expect(test_err).to.have.key('fields');
            expect(test_err.fields).to.deep.equal({ test: err1 });
            expect(test_err.fields.test).to.have.key('errors');
            expect(test_err.fields.test.errors).to.deep.equal([ err2, err3 ]);
        });
        
        it("it should add the errors of the error being added to the parent using the parent field", function(){
            var err1 = new Error('test error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            var err4 = new Error('error 4');
            
            err1 = Errors.add(err1, err2);
            err1 = Errors.add(err1, err3);
            
            expect(err1).to.have.key('errors');
            expect(err1.errors).to.deep.equal([ err2, err3 ]);
            
            var test_err = new Error('test error 2');
            
            test_err = Errors.add(test_err, 'test', err4);
            test_err = Errors.add(test_err, 'test', err1);
            
            expect(test_err).not.to.have.key('errors');
            expect(test_err).to.have.key('fields');
            expect(test_err.fields).to.deep.equal({ test: err4 });
            expect(test_err.fields.test.errors).to.deep.equal([ err1, err2, err3 ]);
        });
        
        it("it should add the fields, of the error being added, to the parent using the parent field", function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            var err4 = new Error('error 4');
            
            err1 = Errors.add(err1, 'field', err2);
            err1 = Errors.add(err1, 'field', err3);
            
            expect(err1).to.have.key('fields');
            expect(err1.fields).to.deep.equal({ field: err2 });
            
            var test_err = new Error('test error');
            
            test_err = Errors.add(test_err, 'test', err4);
            test_err = Errors.add(test_err, 'test', err1);
            
            expect(test_err).not.to.have.key('errors');
            expect(test_err).to.have.key('fields');
            expect(test_err.fields).to.deep.equal({ "test": err4, "test.field": err2 });
            expect(test_err.fields.test.errors).to.deep.equal([ err1 ]);
            expect(test_err.fields["test.field"].errors).to.deep.equal([ err3 ]);
        });
        
        it('should not add an error to itself', function(){
            var err = new Error('test');
            
            expect(function(){
                err = Errors.add(err, err);
            }).not.to.throw();
            
            expect(err).to.not.have.key('errors');
        });
        
        it("should not add an error that has already been added", function(){
            var err = new Error('test');
            var err2 = new Error('test 2');
            
            err = Errors.add(err, err2);
            err = Errors.add(err, err2);
            
            expect(err).to.have.key('errors');
            expect(err.errors).to.deep.equal([err2]);
        });
        
        it("should not add a sub error that has already been added", function(){
            var err = new Error('test');
            var err2 = new Error('test 2');
            
            err2 = Errors.add(err2, err);
            err = Errors.add(err, err2);
            
            expect(err).to.have.key('errors');
            expect(err.errors).to.deep.equal([err2]);
        });
        
        it("should not add a sub error field that has already been added", function(){
            var err = new Error('test');
            var err2 = new Error('test 2');
            
            err2 = Errors.add(err2, 'field', err);
            err = Errors.add(err, err2);
            
            expect(err).to.have.key('errors');
            expect(err.errors).to.deep.equal([err2]);
            expect(err).to.not.have.key('fields');
        });
        
        it("should rebase if the base is generic and the new error added is not", function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            err1.generic = true;
            
            var base = Errors.add(err1, err2);
            
            expect(base).to.equal(err2);
            expect(base).to.not.contain.key('errors');
        });
        
        it("should rebase fields if they are generic but the new field error is not", function(){
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            var err3 = new Error('error 3');
            var err4 = new Error('error 4');
            
            err3.generic = true;
            
            err1 = Errors.add(err1, 'test', err3);
            err2 = Errors.add(err2, 'test', err4);
            
            var base = Errors.add(err1, err2);
            
            expect(base).to.equal(err1);
            expect(base).to.contain.key('fields');
            expect(base.fields).to.deep.equal({ test:err4 });
            expect(base.fields.test).to.not.contain.key('errors');
        });
    });
    
    describe('#rebase()', function(){
        it('should swap err and base', function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.have.key('errors');
            expect(new_base.errors).to.deep.equal([base]);
        });
        
        it('should move errors from the base to the new error', function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            var err1 = new Error('error 1');
            
            base = Errors.add(base, err1);
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.have.key('errors');
            expect(new_base.errors).to.deep.equal([base, err1]);
        });
        
        it('should move fields from the base to the new error', function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            var err1 = new Error('error 1');
            
            base = Errors.add(base, 'test', err1);
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.have.keys(['fields', 'errors']);
            expect(new_base.fields).to.deep.equal({ test:err1 });
            expect(new_base.errors).to.deep.equal([ base ]);
        });
        
        it("should keep errors on the error but move them after the base and it's errors", function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            var err1 = new Error('error 1');
            
            err = Errors.add(err, err1);
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.have.key('errors');
            expect(new_base.errors).to.deep.equal([base, err1]);
        });
        
        it("should keep fields on the error but but will be secondary to any that were already existing on the base error", function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            var err1 = new Error('error 1');
            
            err = Errors.add(err, 'test', err1);
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.contain.key('fields');
            expect(new_base.fields).to.deep.equal({ test:err1 });
            expect(new_base).to.contain.key('errors');
            expect(new_base.errors).to.deep.equal([ base ]);
        });
        
        it("should discard the base if it is generic", function(){
            var base = new Error('base error');
            var err = new Error('new base error');
            var err1 = new Error('error 1');
            var err2 = new Error('error 2');
            
            base.generic = true;
            
            base = Errors.add(base, err1);
            err = Errors.add(err, err2);
            
            var new_base = Errors.rebase(base, err);
            
            expect(new_base).to.equal(err);
            expect(new_base).to.have.key('errors');
            expect(new_base.errors).to.deep.equal([ err1, err2 ]);
        });
    });
});

describe('CustomErrors', function(){
    it('should be able to create a custom error', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var from_error = new Error('test error');
        
        var err = new TestError('message', from_error, { additional:true });
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.error).to.equal(from_error);
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
    });
        
    it('should not need the new operator', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var from_error = new Error('test error');
        
        var err = TestError('message', from_error, { additional:true });
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.error).to.equal(from_error);
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
    });
    
    it('should allow messages to be sent to the user (safe messages)', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123, true);
        
        var from_error = new Error('test error');
        
        var err = TestError('safe message!', from_error, { additional:true });
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('safe message!');
        expect(err.safe_message).to.equal('safe message!');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.error).to.equal(from_error);
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: safe message!');
        expect(err.stack).to.match(/^TestError\: safe message!\r?\n?[^\r\n]+test-errors-base.js/);
    });
    
    it('should default to the default message', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var err = TestError();
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('default_message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect('' + err).to.equal('TestError: default_message');
        expect(err.stack).to.match(/^TestError\: default_message\r?\n?[^\r\n]+test-errors-base.js/);
    });
    
    it('should be able to extend a custom error', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var ExtendedTestError = TestError.extend('ExtendedTestError', 'extended_default_message', 321);
        
        var err = ExtendedTestError('message', null, { additional: true });
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err).to.be.instanceof(ExtendedTestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('extended_default_message');
        expect(err.status_code).to.equal(321);
        expect(err.name).to.equal('ExtendedTestError');
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('ExtendedTestError: message');
        expect(err.stack).to.match(/^ExtendedTestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
    });
    
    it('should allow a custom constructor', function(){
        function TestError(message){
            // only require to call _init
            return TestError._init(this, message);
        }
        
        ErrorsExt.extend(TestError, 'TestError', 'default_message', undefined, true);
        
        var err = new TestError('message');
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('message');
        expect(err.status_code).to.equal(500);
        expect(err.name).to.equal('TestError');
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        
    });
    
    it('should set the field if passed', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var from_error = new Error('test error');
        
        var err = new TestError('message', from_error, { additional:true }, 'test_field');
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.error).to.equal(from_error);
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        expect(err.field).to.equal('test_field');
    });
    
    it('should be optional to have additional information', function(){
        var TestError = ErrorsExt.extend('TestError', 'default_message', 123);
        
        var base_error = TestError('test error');
        
        base_error = Errors.add(base_error, TestError('message', null, 'test_field', base_error));
        base_error = Errors.add(base_error, TestError('message', null, 'test_field2', base_error));
        
        expect(base_error.fields).to.be.an('object');
        
        var err = base_error.fields.test_field;
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        expect(err.field).to.equal('test_field');
        
        err = base_error.fields.test_field2;
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message\r?\n?[^\r\n]+test-errors-base.js/);
        expect(err.field).to.equal('test_field2');
    });
});