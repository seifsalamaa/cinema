"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../validation.js')();
Validation.use(require('@orchardcorset/validation-invalid'));
Validation.use(require('@orchardcorset/validation-types'));

var checkInvalid = require('./util/helper.js').checkInvalid;
require('./util/helper.js').setInvalid(Validation.Invalid);

describe('Validation', function(){
    describe('required', function(){
        it('should make the value required', function(){
            var v = Validation.String('Test string').uppercase().required();
            
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            
            expect(v.validate('hello!')).to.equal('HELLO!');
        });
    });
    
    describe('optional', function(){
        it('should make the value optional', function(){
            var v = Validation.String('Test string').uppercase().optional();
            
            expect(v.validate()).to.equal(undefined);
            expect(v.validate(undefined)).to.equal(undefined);
            expect(v.validate(null)).to.equal(undefined);
            expect(v.validate('')).to.equal(undefined);
            
            expect(v.validate('hi')).to.equal('HI');
        });
    });
    
    describe('conditional', function(){
        it('should not allow any value', function(){
            var v = Validation.String('Test string').uppercase().conditional();
            
            expect(v.validate()).to.equal(undefined);
            expect(v.validate(undefined)).to.equal(undefined);
            expect(v.validate(null)).to.equal(undefined);
            expect(v.validate('')).to.equal(undefined);
            
            checkInvalid(v.validate('hi'), v._friendly_name, 'CONDITIONAL', 'This field should not be set.');
        });
    });
    
    describe('getValidator()', function(){
        it('should return a standalone function for validating a value', function(){
            var validation = Validation.String('Test string').uppercase().required()
            var v = validation.getValidator();
            
            expect(v).to.be.a('function');
            
            checkInvalid(v(''), validation._friendly_name, 'REQUIRED', 'Value is required.');
            
            expect(v('hello!')).to.equal('HELLO!');
        });
    });
    
    describe('addError()', function(){
        it('should add an error to another', function(){
            var err = new Error('base');
            var err2 = new Error('err2');
            var err3 = new Error('err3');
            var err4 = new Error('err4');
            var err5 = new Error('err5');
            
            expect(Validation).to.contain.key('addError');
            expect(Validation.addError).to.be.a('function');
            
            err = Validation.addError(err, err2);
            err = Validation.addError(err, 'test_error', err3);
            
            expect(err).to.be.instanceof(Error);
            expect(err.errors).to.deep.equal([err2]);
            expect(err.fields).to.deep.equal({ test_error:err3 });
            
            err = Validation.addError(err, err4);
            err = Validation.addError(err, 'another_test_error', err5);
            
            expect(err).to.be.instanceof(Error);
            expect(err.errors).to.deep.equal([err2, err4]);
            expect(err.fields).to.deep.equal({ test_error:err3, another_test_error:err5 });
        });
        
        it('should not allow adding an error to itself', function(){
            var err = new Error('base');
            
            expect(Validation.addError(err, err)).to.equal(err);
            expect(err).to.not.contain.key('errors');
        });
        
        it('should throw if no base', function(){
            expect(function(){
                Validation.addError(null, new Error('test'));
            }).to.throw(Error, /^Cannot add error to non object$/);
        });
        
        it('should only add the error to the errors array once', function(){
            var err = new Error('base');
            var err2 = new Error('err2');
            
            err = Validation.addError(err, err2);
            err = Validation.addError(err, err2);
            
            expect(err).to.be.instanceof(Error);
            expect(err.errors).to.deep.equal([err2]);
        });
    });
});

describe('Validation.Chain', function(){
    describe('(call)', function(){
        it('should pass a value through the chain until invalid or all functions have been called', function(){
            var v = Validation.String('Test string').uppercase().length(6, 6).required();
            
            checkInvalid(v.validate('abc'), v._friendly_name, 'LENGTH_MIN', 'Must be at least 6 characters.');
            
            expect(v.validate('hello!')).to.equal('HELLO!');
        });
    });
    
    describe('.has()', function(){
        it('should check a chain for a function', function(){
            var chain = new Validation.Chain();
            var test_fn = function(value){
                return value;
            };
            chain.add(test_fn);
            
            expect(chain.has(test_fn)).to.equal(true);
            expect(chain.has(function(){})).to.equal(false);
        });
    });
});