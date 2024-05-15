"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Errors = require('@orchardcorset/errors-base')();

// extend with capture stack
require('../index.js')(Errors);

describe('Custom Errors', function(){
    it('should now have a stack trace', function(){
        var TestError = Errors.extend('TestError', 'default_message', 123);
        
        expect(TestError._init).to.be.a('function');
        expect(TestError.prototype.name).to.equal('TestError');
        expect(TestError.prototype.status_code).to.equal(123);
        expect(TestError.prototype.safe_message).to.equal('default_message');
        expect(TestError.extend).to.be.a('function');
        
        var err = TestError('message', null, { additional: true });
        
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: message');
        expect(err.stack).to.match(/^TestError\: message.*(\r\n|\r|\n).*test-errors-capture-stack.js/);
    });
});