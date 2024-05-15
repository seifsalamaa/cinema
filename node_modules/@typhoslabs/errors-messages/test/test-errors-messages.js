"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Errors = require('@orchardcorset/errors-base')();

// need the default types extension
require('@orchardcorset/errors-default-types')(Errors);

// extend with messages
require('../index.js')(Errors);

// default message
var DEFUALT_MESSAGE = 'Please check your input:';

describe('Errors.messages()', function(){
    it('should return an ErrorMessage object', function(){
        var err = Errors.UserError('Test message');
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
    });
    
    it('should properly handle primative values', function(){
        expect(Errors.messages(undefined)).to.equal(undefined);
        expect(Errors.messages(null)).to.equal(undefined);
        expect('' + Errors.messages(true)).to.equal('[unknown error]');
        expect('' + Errors.messages(1234)).to.equal('[unknown error]');
        expect('' + Errors.messages('')).to.equal('[unknown error]');
        expect('' + Errors.messages([])).to.equal('[unknown error]');
        expect('' + Errors.messages({})).to.equal('[unknown error]');
    });
    
    it('should work with field errors', function(){
        var err = Errors.UserError('Test message');
        
        err = Errors.add(err, 'name', Errors.UserError('Please enter a valid name'));
        
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
        expect('' + messages.name).to.equal('Please enter a valid name');
    });
    
    it('should work with deep field errors', function(){
        var err = Errors.UserError('Test message');
        
        err = Errors.add(err, 'addresses.0.zip', Errors.UserError('Please enter a valid zip'));
        
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
        expect('' + messages.addresses).to.equal(DEFUALT_MESSAGE);
        expect('' + messages.addresses[0]).to.equal(DEFUALT_MESSAGE);
        expect('' + messages.addresses[0].zip).to.equal('Please enter a valid zip');
    });
    
    it('should get messages from fields on fields', function(){
        // create a customer error
        var customer_error = Errors.UserError('Please check your customer information:');
        // add a error for the first_name field
        customer_error = Errors.add(customer_error, 'first_name', Errors.UserError('Please enter a valid name'));
        
        // create a base error
        var err = Errors.UserError('Test message');
        // and add the customer error to it
        err = Errors.add(err, 'customer', customer_error);
        
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
        expect('' + messages.customer).to.equal('Please check your customer information:');
        expect('' + messages.customer.first_name).to.equal('Please enter a valid name');
    });
    
    it('should use a parent level message', function(){
        // create a customer error
        var customer_error = Errors.UserError('Please check your customer information:');
        // add a error for the first_name field
        var customer_name_error = Errors.UserError('Please enter a valid name');
        
        // create a base error
        var err = Errors.UserError('Test message');
        err = Errors.add(err, "customer", customer_error);
        err = Errors.add(err, "customer.first_name", customer_name_error);
        
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
        expect('' + messages.customer).to.equal('Please check your customer information:');
        expect('' + messages.customer.first_name).to.equal('Please enter a valid name');
    });
    
    it('should use a parent level message even if it follows the child value in the fields', function(){
        // create a customer error
        var customer_error = Errors.UserError('Please check your customer information:');
        // add a error for the first_name field
        var customer_name_error = Errors.UserError('Please enter a valid name');
        
        // create a base error
        var err = Errors.UserError('Test message');
        
        // and the errors to it
        // HACK: this is to force the parent to be after the child and could break if the way
        //       fields are handled changes
        err.fields = {
            "customer.first_name": customer_name_error,
            "customer": customer_error
        };
        
        var messages = Errors.messages(err);
        
        expect(messages).to.be.an.instanceof(Errors.Message);
        
        expect('' + messages).to.equal('Test message');
        expect('' + messages.customer).to.equal('Please check your customer information:');
        expect('' + messages.customer.first_name).to.equal('Please enter a valid name');
    });
    
    it('should handle an error with no message', function(){
        var messages = Errors.messages({});
        expect('' + messages).to.equal('[unknown error]');
    });
});