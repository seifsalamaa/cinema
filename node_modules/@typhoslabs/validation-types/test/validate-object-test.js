"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('@orchardcorset/validation-base')();
var Invalid = require('@orchardcorset/validation-invalid')(Validation);
require('../index.js')(Validation);

var checkInvalid = require('./util/helper.js').checkInvalid;
require('./util/helper.js').setInvalid(Invalid);

describe('ObjectValidation', function(){
    describe('.validate()', function(){
        it('should validate the object', function(){
            var v = Validation.Object({
                s: Validation.String('Test string').uppercase()
            });
            
            var data = 'bad';
            var result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
            
            data = null;
            result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
            
            data = undefined;
            result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
            
            data = {};
            result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            
            data = { s:"Hello" };
            result = v.validate(data);
            expect(result).to.eql({
                s:"HELLO"
            });
        });
        
        it('should allow any fields if there are none defined', function(){
            var v = Validation.Object().required();
            
            expect(v.validate({})).to.deep.equal({});
            expect(v.validate({ data:'abc' })).to.deep.equal({ data:'abc' });
        });
        
        it('should allow any fields if lenient', function(){
            var v = Validation.Object({
                test: Validation.String().uppercase()
            }).lenient().required();
            
            expect(v.validate({ test:'String' })).to.deep.equal({ test:'STRING' });
            expect(v.validate({ test:'String', data:'abc' })).to.deep.equal({ test:'STRING', data:'abc' });
            
            var bad = v.validate({ test:false, data:false });
            checkInvalid(bad, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            expect(bad).to.not.contain.key('errors');
            expect(bad.fields).to.have.keys('test');
            checkInvalid(bad.fields.test, v.test._friendly_name, 'TYPE_STRING', 'Value must be a string.');
        });
        
        it('should not allow any fields if lenient and strict... because who would do that?!?', function(){
            var v = Validation.Object({
                test: Validation.String().uppercase()
            }).lenient().strict().required();
            
            expect(v.validate({ test:'String' })).to.deep.equal({ test:'STRING' });
            
            var bad = v.validate({ test:'String', data:'abc' });
            checkInvalid(bad, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            expect(bad).to.not.contain.key('errors');
            expect(bad.fields).to.have.keys('data');
            checkInvalid(bad.fields.data, 'data', 'NO_VALIDATION', 'Field has no validation defined.');
            
            // and now the same but strict before lenient
            
            v = Validation.Object({
                test: Validation.String().uppercase()
            }).strict().lenient().required();
            
            expect(v.validate({ test:'String' })).to.deep.equal({ test:'STRING' });
            
            bad = v.validate({ test:'String', data:'abc' });
            checkInvalid(bad, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            expect(bad).to.not.contain.key('errors');
            expect(bad.fields).to.have.keys('data');
            checkInvalid(bad.fields.data, 'data', 'NO_VALIDATION', 'Field has no validation defined.');
        });
        
        it('should allow _id and __v fields', function(){
            var v = Validation.Object({
                _id: Validation.String().required(),
                __v: Validation.Number().required()
            });
            
            expect(v.validate({ _id:"test", __v:1 })).to.deep.equal({_id:"test", __v:1});
        });
        
        it('should work with reqired and optional', function(){
            var v = Validation.Object({
                s: Validation.String('Test string').uppercase()
            }).required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate({s:'hello'})).to.eql({s:'HELLO'});
            
            v = Validation.Object({
                s: Validation.String('Test string').uppercase()
            }).optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate({s:'hello'})).to.eql({s:'HELLO'});
        });
        
        it('should not allow bad field names', function(){
            expect(function(){
                Validation.Object({
                    "": Validation.String('bad')
                });
            }).to.throw(Error, /^ObjectValidation field cannot be null, begin with an underscore, or contain a period\.$/);
            
            expect(function(){
                Validation.Object({
                    _bad: Validation.String('bad')
                });
            }).to.throw(Error, /^ObjectValidation field cannot be null, begin with an underscore, or contain a period\.$/);
            
            expect(function(){
                Validation.Object({
                    "bad.value": Validation.String('bad')
                });
            }).to.throw(Error, /^ObjectValidation field cannot be null, begin with an underscore, or contain a period\.$/);
        });
        
        it('should not allow values that have no validation', function(){
            var v = Validation.Object({
                s: Validation.String('Test string').uppercase()
            });
            
            var data = { s:"hello", bad:'Bad field.' };
            var result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.bad, 'bad', 'NO_VALIDATION', 'Field has no validation defined.');
        });
        
        it('should allow nesting', function(){
            var v = Validation.Object({
                o: Validation.Object({
                    s: Validation.String('Test string').uppercase()
                })
            });
            
            var data = {};
            var result = v.validate(data);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.o, v.o._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
            
            data = { o:{ s:"Hello" } };
            result = v.validate(data);
            expect(result).to.eql({o:{s:'HELLO'}});
        });
        
        it('should fill out a valid object if passed', function(){
            var v = Validation.Object({
                o: Validation.Object({
                    s: Validation.String('Test string').uppercase()
                }),
                s: Validation.String('Test string').lowercase()
            });
            
            var data = { s:"Hello" };
            var valid = {};
            var result = v.validate(data, valid);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.o, v.o._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
            expect(valid).to.eql({s:"hello"});
            
            data = { s:"Hello", o:{ s:"hello", bad:"Bad field." } };
            valid = {};
            result = v.validate(data, valid);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.o, v.o._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            expect(valid).to.eql({ s:"hello", o:{ s:"HELLO" } });
            
            data = { o:{ s:"Hello" }, s:"Hello" };
            valid = {};
            result = v.validate(data, valid);
            expect(result).to.eql({ o:{ s:'HELLO' }, s:"hello" });
            expect(result).to.equal(valid);
        });
        
        it('should work with an array validation', function(){
            var v = Validation.Object({
                a: Validation.Array(Validation.String('Test string').uppercase()),
                s: Validation.String('Test string').lowercase()
            });
            
            var data = { s:"Hello" };
            var valid = {};
            var result = v.validate(data, valid);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.a, v.a._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');
            expect(valid).to.eql({s:"hello"});
            
            data = { s:"Hello", a:["hello", 666, 'good'] };
            valid = {};
            result = v.validate(data, valid);
            checkInvalid(result, v._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
            checkInvalid(result.fields.a, v.a._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
            
            var t = [];
            t[0] = "HELLO";
            t[2] = "GOOD";
            
            expect(valid).to.eql({ s:"hello", a:t });
            
            data = { a:["Hello", "good", "WORLD"], s:"Hello" };
            valid = {};
            result = v.validate(data, valid);
            expect(result).to.eql({ a:["HELLO", "GOOD", "WORLD"], s:"hello" });
            expect(result).to.equal(valid);
        });
    });
});