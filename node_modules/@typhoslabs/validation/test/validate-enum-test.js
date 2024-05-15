"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var checkInvalid = require('./util/helper.js').checkInvalid;

describe('EnumValidation', function(){
    describe('.validate()', function(){
        it('should validate based on enumeration values', function(){
            var v = Validation.Enum(['a', 'b', 'c'], 'Test enumeration');
            
            expect(v.validate('a')).to.eql('a');
            expect(v.validate('b')).to.eql('b');
            expect(v.validate('c')).to.eql('c');
            
            checkInvalid(v.validate('d'), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate(null), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate(true), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate(false), v._friendly_name, 'ENUM', 'Invalid value.');
        });
        
        it('should work with reqired and optional', function(){
            var v = Validation.Enum(['a', 'b', 'c'], 'Test enumeration').required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate('a')).to.eql('a');
            
            v = Validation.Enum(['a', 'b', 'c'], 'Test enumeration').optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate('a')).to.eql('a');
        });
        
        it('should throw if missing or invalid enumeration values', function(){
            expect(function(){
                Validation.Enum();
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
            
            expect(function(){
                Validation.Enum(undefined);
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
            
            expect(function(){
                Validation.Enum(null);
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
            
            expect(function(){
                Validation.Enum({});
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
            
            expect(function(){
                Validation.Enum({ "0": "test" });
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
            
            expect(function(){
                Validation.Enum([]);
            }).to.throw(Error, /^EnumValidation\(\) requires an array of enumeration values\./);
        });
    });
});