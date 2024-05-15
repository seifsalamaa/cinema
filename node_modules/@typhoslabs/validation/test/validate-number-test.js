"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var checkInvalid = require('./util/helper.js').checkInvalid;

describe('NumberValidation', function(){
    describe('.validate()', function(){
        it('should validate a number value', function(){
            var v = Validation.Number('Test number');
            
            checkInvalid(v.validate(undefined), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate(null), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate(true), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate(false), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate('bad'), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate('1e-1'), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate('1E-1'), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate('1e1'), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate('1E1'), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            checkInvalid(v.validate(NaN), v._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
            
            expect(v.validate(1)).to.equal(1);
            expect(v.validate(0.0000001)).to.equal(0.0000001);
            expect(v.validate(-1)).to.equal(-1);
            expect(v.validate(-0.0000001)).to.equal(-0.0000001);
            expect(v.validate(0)).to.equal(0);
            expect(v.validate("1")).to.equal(1);
            expect(v.validate(Number.POSITIVE_INFINITY)).to.equal(Number.POSITIVE_INFINITY);
            expect(v.validate(Number.NEGATIVE_INFINITY)).to.equal(Number.NEGATIVE_INFINITY);
            expect(v.validate(Number.MAX_VALUE)).to.equal(Number.MAX_VALUE);
            expect(v.validate(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
        });
        
        it('should work with reqired and optional', function(){
            var v = Validation.Number('Test number').required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate(1)).to.eql(1);
            
            v = Validation.Number('Test number').optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate(1)).to.eql(1);
        });
    });
    
    describe('.int()', function(){
        it('should require the value to be an integer', function(){
            var v = Validation.Number('Test number').int();
            
            checkInvalid(v.validate(0.1), v._friendly_name, 'INT', 'Value must be an integer.');
            checkInvalid(v.validate(1.1), v._friendly_name, 'INT', 'Value must be an integer.');
            checkInvalid(v.validate(1.000000000000001), v._friendly_name, 'INT', 'Value must be an integer.');
            expect(v.validate(1.0000000000000001)).to.equal(1); // floating point accuracy problem
            checkInvalid(v.validate(1E-99), v._friendly_name, 'INT', 'Value must be an integer.');
            expect(v.validate(1E-999)).to.equal(0); // floating point accuracy problem
            
            expect(v.validate(1)).to.equal(1);
            expect(v.validate(-1)).to.equal(-1);
            expect(v.validate(0)).to.equal(0);
            expect(v.validate("1")).to.equal(1);
        });
    });
    
    describe('.max()', function(){
        it('should make sure the value is not larger than a given number', function(){
            var v = Validation.Number('Test number').max(9.999);
            
            checkInvalid(v.validate(Number.POSITIVE_INFINITY), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(Number.MAX_VALUE), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(10), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(9.99900000001), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(9.9990000000001), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(9.9990001), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(9.99901), v._friendly_name, 'MAX', 'Value too large.');
            checkInvalid(v.validate(9.9991), v._friendly_name, 'MAX', 'Value too large.');
            expect(v.validate(9.9990000000000001)).to.equal(9.999); // floating point accuracy problem
            
            expect(v.validate(9.999)).to.equal(9.999);
            expect(v.validate(9)).to.equal(9);
            expect(v.validate(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
            expect(v.validate(Number.NEGATIVE_INFINITY)).to.equal(Number.NEGATIVE_INFINITY);
        });
    });
    
    describe('.min()', function(){
        it('should make sure the value is not smaller than a given number', function(){
            var v = Validation.Number('Test number').min(9.999);
            
            checkInvalid(v.validate(Number.NEGATIVE_INFINITY), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(Number.MIN_VALUE), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(0.1), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9.9), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9.99), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9.998), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9.9989), v._friendly_name, 'MIN', 'Value too small.');
            checkInvalid(v.validate(9.998999999999999), v._friendly_name, 'MIN', 'Value too small.');
            expect(v.validate(9.9989999999999999)).to.equal(9.999); // floating point accuracy problem
            
            expect(v.validate(9.999)).to.equal(9.999);
            expect(v.validate(10)).to.equal(10);
            expect(v.validate(Number.MAX_VALUE)).to.equal(Number.MAX_VALUE);
            expect(v.validate(Number.POSITIVE_INFINITY)).to.equal(Number.POSITIVE_INFINITY);
        });
    });
    
    describe('.range()', function(){
        it('should only allow number inside a matching range', function(){
            var v = Validation.Number('Test number').range(0, 100);
            
            checkInvalid(v.validate(Number.NEGATIVE_INFINITY), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            checkInvalid(v.validate(-1), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            checkInvalid(v.validate(100.000001), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            checkInvalid(v.validate(Number.MAX_VALUE), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            checkInvalid(v.validate(Number.POSITIVE_INFINITY), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            
            expect(v.validate(0)).to.equal(0);
            expect(v.validate(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
            expect(v.validate(50)).to.equal(50);
            expect(v.validate(100)).to.equal(100);
        });
        
        
        it('should allow multiple ranges', function(){
            var v = Validation.Number('Test number').range(-3, -2.999, 0, 100);
            
            checkInvalid(v.validate(Number.NEGATIVE_INFINITY), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(-1), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(100.000001), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(Number.MAX_VALUE), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(Number.POSITIVE_INFINITY), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(-3.000001), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate(-2.998999), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            
            expect(v.validate(0)).to.equal(0);
            expect(v.validate(Number.MIN_VALUE)).to.equal(Number.MIN_VALUE);
            expect(v.validate(50)).to.equal(50);
            expect(v.validate(100)).to.equal(100);
            
            expect(v.validate(3)).to.equal(3);
            expect(v.validate(2.9991)).to.equal(2.9991);
        });
        
        it('should throw when passed invalid arguments', function(){
            expect(function(){
                Validation.Number('Test number').range();
            }).to.throw(Error, /^NumberValidation\.range\(\) missing argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(1);
            }).to.throw(Error, /^NumberValidation\.range\(\) missing argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(1, 2, 3);
            }).to.throw(Error, /^NumberValidation\.range\(\) missing argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range('bad', 1);
            }).to.throw(Error, /^NumberValidation\.range\(\) invalid number argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(1, 'bad');
            }).to.throw(Error, /^NumberValidation\.range\(\) invalid number argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(1, 2, 3, 'bad');
            }).to.throw(Error, /^NumberValidation\.range\(\) invalid number argument\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(1, -1);
            }).to.throw(Error, /^NumberValidation\.range\(\) min value is greater than max value\.$/);
            
            expect(function(){
                Validation.Number('Test number').range(0, 0.0000001, 1, -1);
            }).to.throw(Error, /^NumberValidation\.range\(\) min value is greater than max value\.$/);
        });
    });
});