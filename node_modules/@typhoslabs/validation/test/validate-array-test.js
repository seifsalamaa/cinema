"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var checkInvalid = require('./util/helper.js').checkInvalid;

describe('ArrayValidation', function(){
    describe('.validate()', function(){
        it('should validate an array value', function(){
            var v = Validation.Array(Validation.String(), 'Test Array');
            
            checkInvalid(v.validate(null), v._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            checkInvalid(v.validate({}), v._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            checkInvalid(v.validate('bad'), v._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            
            var a = [];
            expect(v.validate(a)).to.eql(a);
        });
        it('should work with reqired and optional', function(){
            var v = Validation.Array(undefined, 'Test Array').required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate([])).to.eql([]);
            
            v = Validation.Array(undefined, 'Test Array').optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate([])).to.eql([]);
        });
        it('should validate all array values based on the validation passed', function(){
            var v = Validation.Array(Validation.String('Test string'), 'Test Array');
            
            var a = ['test', false];
            var result = v.validate(a);
            
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            expect(result.fields).not.to.have.key('0');
            checkInvalid(result.fields[1], v[0]._friendly_name, 'TYPE_STRING', "Value must be a string.");
            
            a = ['test', 'false'];
            result = v.validate(a);
            
            expect(result).to.eql(a);
        });
        it('should only run the chain if no validation is passed', function(){
            var v = Validation.Array(undefined, 'Test Array').length(4);
            
            var a = ['a', false, {}, null, 'e'];
            var result = v.validate(a);
            checkInvalid(result, v._friendly_name, 'LENGTH_MAX', 'Too many values.');
            
            a = ['a', false, {}, null];
            expect(v.validate(a)).to.eql(a);
        });
        it('should fill out a valid array if passed', function(){
            var v = Validation.Array(Validation.String('Test string').uppercase(), 'Test Array');
            
            var a = ['test', false];
            var ok = ['TEST', 'FALSE'];
            var valid = [];
            var result = v.validate(a, valid);
            
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            expect(result.fields).not.to.have.key('0');
            checkInvalid(result.fields[1], v[0]._friendly_name, 'TYPE_STRING', "Value must be a string.");
            
            expect(valid.length).to.equal(1);
            expect(valid[0]).to.equal(ok[0]);
            
            a = ['test', 'false'];
            valid = [];
            result = v.validate(a, valid);
            
            expect(result).to.eql(ok);
            expect(result).to.equal(valid);
            expect(valid.length).to.equal(2);
            expect(valid[0]).to.equal(ok[0]);
            expect(valid[1]).to.equal(ok[1]);
        });
        it('should be nestable', function(){
            var v = Validation.Array(
                Validation.Array(
                    Validation.String('Test string').uppercase(),
                'Child'),
            'Parent');
            
            var a = [false];
            var valid = [];
            var result = v.validate(a, valid);
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields[0], v[0]._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            expect(valid).to.eql([]);
            
            a = [[false, 'good', 666, 'ok']];
            valid = [];
            result = v.validate(a, valid);
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields[0], v[0]._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            
            var t = [];
            t[1] = 'GOOD';
            t[3] = 'OK';
            expect(valid).to.eql([t]);
            
            a = [['good', 'ok']];
            valid = [];
            result = v.validate(a, valid);
            expect(result).to.eql([['GOOD', 'OK']]);
            expect(result).to.equal(valid);
        });
        
        it('should work with objects', function(){
            var v = Validation.Array(
                Validation.Object({
                    s: Validation.String('Test string').uppercase()
                }, 'Test Object'),
            'Test array');
            
            var a, valid, result;
            
            a = [false];
            valid = [];
            result = v.validate(a, valid);
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            expect(valid).to.eql([]);
            
            a = [{ s:"hello", bad:"value"}, false ];
            valid = [];
            result = v.validate(a, valid);
            checkInvalid(result, v._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields[0], v[0]._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            expect(valid).to.eql([ { s:"HELLO" } ]);
            
            a = [ { s:"hello" }, { s:"world" } ];
            valid = [];
            result = v.validate(a, valid);
            expect(result).to.eql([ { s:"HELLO" }, { s:"WORLD" } ]);
            expect(valid).to.equal(result);
        });
    });
    
    describe('.length()', function(){
        it('should not allow invalid values', function(){
            expect(function(){
                Validation.Array(Validation.String('Test string'), 'Test Array').length('bad');
            }).to.throw(Error, /ArrayValidation\.length\(\) invalid values\./);
            expect(function(){
                Validation.Array(Validation.String('Test string'), 'Test Array').length('bad', 1);
            }).to.throw(Error, /ArrayValidation\.length\(\) invalid values\./);
            expect(function(){
                Validation.Array(Validation.String('Test string'), 'Test Array').length(1, 'bad');
            }).to.throw(Error, /ArrayValidation\.length\(\) invalid values\./);
        });
        it('should validate an array\'s length', function(){
            var v = Validation.Array(Validation.String('Test string'), 'Test Array').length(1,4);
            
            var a = [];
            var result = v.validate(a);
            checkInvalid(result, v._friendly_name, 'LENGTH_MIN', 'Not enough values.');
            
            a = ['a', 'b', 'c', 'd', 'e'];
            result = v.validate(a);
            checkInvalid(result, v._friendly_name, 'LENGTH_MAX', 'Too many values.');
            
            a = ['a', 'b', 'c', 'd'];
            expect(v.validate(a)).to.eql(a);
            
            v = Validation.Array(Validation.String('Test string'), 'Test Array').length(4);
            expect(v.validate(a)).to.eql(a);
        });
        it('should use another function if only max is passed', function(){
            var v = Validation.Array(Validation.String('Test string'), 'Test Array').length(4);
            
            var a = ['a', 'b', 'c', 'd', 'e'];
            var result = v.validate(a);
            checkInvalid(result, v._friendly_name, 'LENGTH_MAX', 'Too many values.');
        });
    });
});