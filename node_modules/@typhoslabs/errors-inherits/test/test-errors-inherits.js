"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Errors = require('@orchardcorset/errors-base')();

// use inherits
require('../index.js')(Errors);


describe('ErrorsInherits', function(){
    it('should make it so custom errors are instanceof Error', function(){
        var TestError = Errors.extend('TestError', 'default_message', 123);
            
        expect(TestError._init).to.be.a('function');
        expect(TestError.prototype.name).to.equal('TestError');
        expect(TestError.prototype.status_code).to.equal(123);
        expect(TestError.prototype.safe_message).to.equal('default_message');
        expect(TestError.extend).to.be.a('function');
        
        var err = TestError('message', null, { additional: true });
        
        expect(err).to.be.instanceof(Error);
        expect(err).to.be.instanceof(TestError);
        expect(err.message).to.equal('message');
        expect(err.safe_message).to.equal('default_message');
        expect(err.status_code).to.equal(123);
        expect(err.name).to.equal('TestError');
        expect(err.additional).to.deep.equal({ additional:true });
        expect('' + err).to.equal('TestError: message');
    });
});