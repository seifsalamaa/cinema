"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('@orchardcorset/validation-base')();
var Errors = require('@orchardcorset/errors');

// use the invalid extension
var Invalid = require('@orchardcorset/validation-invalid')(Validation);

// use the invalid-error extension
require('../index.js')(Validation);



describe('Validation', function(){
    describe('Invalid (setup)', function(){
        it('should throw if no invalid to work with', function(){
            expect(function(){
                require('../index.js')();
            }).to.throw(Error, /^validation\-base and Validation\.Invalid are needed before validation\-invalid\-error can work its magic\.$/);
            
            expect(function(){
                require('../index.js')(require('@orchardcorset/validation-base')());
            }).to.throw(Error, /^validation\-base and Validation\.Invalid are needed before validation\-invalid\-error can work its magic\.$/);
        });
    });
    
    describe('Invalid (instance)', function(){
        it('should be an instanceof Error', function(){
            var invalid = new Validation.Invalid('There was an issue with your input');
            
            expect(invalid).to.be.an.instanceof(Error);
            expect(invalid.status_code).to.equal(400);
        });
    });
    
    describe('Invalid.toString()', function(){
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
    
    describe('.addError()', function(){
        it('should just call Errors.add()', function(){
            var err = new Error('Test');
            var err_a = new Error('a');
            var err_b = new Error('b');
            
            err = Validation.addError(err, err_a);
            err = Validation.addError(err, 'b', err_b);
            
            expect(err).to.be.instanceof(Error);
            expect(err.errors).to.deep.equal([err_a]);
            expect(err.fields).to.deep.equal({ b:err_b });
        });
    });
});