"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var Invalid = Validation.Invalid;
var checkInvalid = require('./util/helper.js').checkInvalid;
var Errors = require('@orchardcorset/errors');

describe('Invalid', function(){
    describe('new', function(){
        it('should store the fields passed to it', function(){
            var i = Invalid('field', 'TEST', 'This field is invalid');
            
            expect(i).to.be.instanceof(Validation.Invalid);
            expect(i._friendly_name).to.equal('field');
            expect(i._type).to.equal('TEST');
            expect(i.message).to.equal('This field is invalid');
        });
        
        it('should behave like an error', function(){
            var i = Invalid('field', 'TEST', 'This field is invalid');
            
            expect(i).to.be.instanceof(Error);
            expect(i.stack).to.match(/^Invalid\: This field is invalid\r?\n?[^\r\n]+validation\-invalid\-test\.js/);
            expect(i.status_code).to.equal(400);
            expect(i.message).to.equal('This field is invalid');
            expect(i.safe_message).to.equal('This field is invalid');
        });
        
        it('should work with no friendly_name or type', function(){
            var i = Invalid(undefined, undefined, 'This field is invalid');
            
            checkInvalid(i, undefined, undefined, 'This field is invalid');
        });
        
        it('should default to undefined friendly_name and type', function(){
            var i = Invalid('This field is invalid');
            checkInvalid(i, undefined, undefined, 'This field is invalid');
            
            i = Invalid('friendly', 'This field is invalid');
            checkInvalid(i, 'friendly', undefined, 'This field is invalid');
        });
    });
    
    describe('.toString()', function(){
        it('should return a pretty string representation of the error', function(){
            var i = Invalid('field', 'TEST', 'This field is invalid');
            expect(i.toString()).to.equal('This field is invalid');
        });
        
        it('should return field messages', function(){
            var i = Invalid('field', 'TEST', 'This field is invalid');
            Errors.add(i, 'subfield', Invalid('Subfield', 'TEST', 'This subfield is invalid'));
            Errors.add(i, 'subfield2', Invalid(undefined, undefined, 'This subfield is invalid'));
            expect(i.toString()).to.equal('This field is invalid\r\n\tSubfield: This subfield is invalid\r\n\tsubfield2: This subfield is invalid');
        });
        
        it('should show "[no message]" if there was no message on the instance', function(){
            var i = Invalid('test');
            delete i.message;
            expect(i.toString()).to.equal('[no message]');
        });
    });
});

// writing unit tests on unit test helper functions... yeah...
describe('checkInvalid', function(){
    it('should check the fields passed', function(){
        var i = Invalid('field', 'TEST', 'This field is invalid');
        
        expect(i).to.be.instanceof(Validation.Invalid);
        expect(i._friendly_name).to.equal('field');
        expect(i._type).to.equal('TEST');
        expect(i.message).to.equal('This field is invalid');
        
        checkInvalid(i, 'field', 'TEST', 'This field is invalid');
        
        expect(function(){
            checkInvalid({});
        }).to.throw(Error, /^AssertionError\: expected \{\} to be an instance of Invalid$/);
        
        expect(function(){
            checkInvalid(i, 'bad', 'TEST', 'This field is invalid');
        }).to.throw(Error, /^AssertionError\: expected \'field\' to equal \'bad\'$/);
        
        expect(function(){
            checkInvalid(i, 'field', 'bad', 'This field is invalid');
        }).to.throw(Error, /^AssertionError\: expected \'TEST\' to equal \'bad\'$/);
        
        expect(function(){
            checkInvalid(i, 'field', 'TEST', 'bad');
        }).to.throw(Error, /^AssertionError\: expected \'This field is invalid\' to equal \'bad\'$/);
    });
});