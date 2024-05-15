"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var checkInvalid = require('./util/helper.js').checkInvalid;

describe('BooleanValidation', function(){
    describe('.validate()', function(){
        it('should validate a boolean value', function(){
            var v = Validation.Boolean('Test boolean');
            
            checkInvalid(v.validate(undefined), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(null), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate('bad'), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(2), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(-2), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(Number.POSITIVE_INFINITY), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(Number.NEGATIVE_INFINITY), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            checkInvalid(v.validate(NaN), v._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
            
            expect(v.validate(true)).to.eql(true);
            expect(v.validate(false)).to.eql(false);
            expect(v.validate("true")).to.eql(true);
            expect(v.validate("false")).to.eql(false);
            expect(v.validate(0)).to.eql(false);
            expect(v.validate(1)).to.eql(true);
            expect(v.validate(-1)).to.eql(false);
        });
        
        it('should work with reqired and optional', function(){
            var v = Validation.Boolean('Test boolean').required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate(true)).to.eql(true);
            
            v = Validation.Boolean('Test boolean').optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate(true)).to.eql(true);
        });
    });
    
    describe('.true()', function(){
        it('should check if the value is true', function(){
            var v = Validation.Boolean('Test boolean').true();
            
            expect(v.validate(true)).to.equal(true);
            
            checkInvalid(v.validate(false), v._friendly_name, 'TRUE', 'Value must be true.');
        });
    });
    
    describe('.false()', function(){
        it('should check if the value is false', function(){
            var v = Validation.Boolean('Test boolean').false();
            
            expect(v.validate(false)).to.equal(false);
            
            checkInvalid(v.validate(true), v._friendly_name, 'FALSE', 'Value must be false.');
        });
    });
});