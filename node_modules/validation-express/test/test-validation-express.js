"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');

describe('Validation', function(){
    describe('express', function(){
        it('should create an express mount for validating a POST body', function(){
            var mount = Validation.express({
                name: Validation.String().length(100),
                email: Validation.String().email()
            });
            
            var body = { name: 'Joshua', email: 'josh@orchardcorset.com' };
            var req = { body: body };
            
            mount(req, {}, function(err){
                if(err){
                    throw err;
                }
                
                expect(req.valid).to.deep.equal(body);
                expect(req).to.not.have.key('invalid');
            });
        });
        it('should flag all invalid fields', function(){
            var mount = Validation.express({
                name: Validation.String().length(10),
                email: Validation.String().email().uppercase()
            });
            
            var body = { name: 'Joshua Sullivan', email: 'josh@orchardcorset.com' };
            var req = { body: body };
            
            mount(req, {}, function(err){
                if(err){
                    throw err;
                }
                
                expect(req.valid).to.deep.equal({ email: 'JOSH@ORCHARDCORSET.COM' });
                expect(req.invalid).to.be.an.instanceof(Validation.Invalid);
                expect(req.invalid.fields).to.have.key('name');
            });
        });
        
        it('should work with req.query', function(){
            var mount = Validation.express({
                name: Validation.String().length(10),
                email: Validation.String().email().uppercase()
            }, { query: true });
            
            var query = { name: 'Joshua Sullivan', email: 'josh@orchardcorset.com' };
            var req = { query: query };
            
            mount(req, {}, function(err){
                if(err){
                    throw err;
                }
                
                expect(req.valid).to.deep.equal({ email: 'JOSH@ORCHARDCORSET.COM' });
                expect(req.invalid).to.be.an.instanceof(Validation.Invalid);
                expect(req.invalid.fields).to.have.key('name');
            });
        });
        
        it('should silently ignore fields without validation', function(){
            var mount = Validation.express({
                name: Validation.String().length(100),
                email: Validation.String().email().uppercase()
            });
            
            var body = { name: 'Joshua Sullivan', email: 'josh@orchardcorset.com', bad:'value without validation' };
            var req = { body: body };
            
            mount(req, {}, function(err){
                if(err){
                    throw err;
                }
                
                expect(req.valid).to.deep.equal({ name: 'Joshua Sullivan', email: 'JOSH@ORCHARDCORSET.COM' });
                expect(req.invalid).to.be.equal(undefined);
            });
        });
    });
});