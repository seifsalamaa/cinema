"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Errors = require('@orchardcorset/errors-base')();

// add the inherits and capture-stack plugins
require('@orchardcorset/errors-inherits')(Errors);
require('@orchardcorset/errors-capture-stack')(Errors);

// extend with all the default types
require('../index.js')(Errors);

describe('Default Errors', function(){
    describe('AuthError', function(){
        it('should return 401 and handle all arguments passed', function(){
            var err = Errors.AuthError('auth message', new Error('test error'), { additional:'AuthError' }, 'AuthError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.AuthError);
            expect(err.message).to.equal('auth message');
            expect(err.safe_message).to.equal('Authorization required.');
            expect(err.status_code).to.equal(401);
            expect(err.name).to.equal('AuthError');
            expect(err.additional).to.deep.equal({ additional:'AuthError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('AuthError: auth message');
            expect(err.stack).to.match(/^AuthError\: auth message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('AuthError');
        });
    });

    describe('NotFoundError', function(){
        it('should return 404 and handle all arguments passed', function(){
            var err = Errors.NotFoundError('not found message', new Error('test error'), { additional:'NotFoundError' }, 'NotFoundError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.NotFoundError);
            expect(err.message).to.equal('not found message');
            expect(err.safe_message).to.equal('Not found.');
            expect(err.status_code).to.equal(404);
            expect(err.name).to.equal('NotFoundError');
            expect(err.additional).to.deep.equal({ additional:'NotFoundError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('NotFoundError: not found message');
            expect(err.stack).to.match(/^NotFoundError\: not found message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('NotFoundError');
        });
    });

    describe('UserError', function(){
        it('should return 400 and the message and handle all arguments passed', function(){
            var err = Errors.UserError('user message', new Error('test error'), { additional:'UserError' }, 'UserError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.UserError);
            expect(err.message).to.equal('user message');
            expect(err.safe_message).to.equal('user message');
            expect(err.status_code).to.equal(400);
            expect(err.name).to.equal('UserError');
            expect(err.additional).to.deep.equal({ additional:'UserError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('UserError: user message');
            expect(err.stack).to.match(/^UserError\: user message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('UserError');
        });
    });

    describe('NotifyUser', function(){
        it('should return 500 and the message and handle all arguments passed', function(){
            var err = Errors.NotifyUser('notify user message', new Error('test error'), { additional:'NotifyUser' }, 'NotifyUser');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.NotifyUser);
            expect(err.message).to.equal('notify user message');
            expect(err.safe_message).to.equal('notify user message');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('NotifyUser');
            expect(err.additional).to.deep.equal({ additional:'NotifyUser' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('NotifyUser: notify user message');
            expect(err.stack).to.match(/^NotifyUser\: notify user message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('NotifyUser');
        });
    });

    describe('HTTPRequestError', function(){
        it('should return 500 and handle all arguments passed', function(){
            var err = Errors.HTTPRequestError('http request error message', new Error('test error'), { additional:'HTTPRequestError' }, 'HTTPRequestError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.HTTPRequestError);
            expect(err.message).to.equal('http request error message');
            expect(err.safe_message).to.equal('Bad response from server.');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('HTTPRequestError');
            expect(err.additional).to.deep.equal({ additional:'HTTPRequestError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('HTTPRequestError: http request error message');
            expect(err.stack).to.match(/^HTTPRequestError\: http request error message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('HTTPRequestError');
        });
    });

    describe('DevError', function(){
        it('should return 500 and handle all arguments passed', function(){
            var err = Errors.DevError('dev message', new Error('test error'), { additional:'DevError' }, 'DevError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.DevError);
            expect(err.message).to.equal('dev message');
            expect(err.safe_message).to.equal('Bad setup on server.');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('DevError');
            expect(err.additional).to.deep.equal({ additional:'DevError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('DevError: dev message');
            expect(err.stack).to.match(/^DevError\: dev message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('DevError');
        });
    });

    describe('ServerError', function(){
        it('should return 500 and handle all arguments passed', function(){
            var err = Errors.ServerError('server error message', new Error('test error'), { additional:'ServerError' }, 'ServerError');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.ServerError);
            expect(err.message).to.equal('server error message');
            expect(err.safe_message).to.equal('Server error occurred.');
            expect(err.status_code).to.equal(500);
            expect(err.name).to.equal('ServerError');
            expect(err.additional).to.deep.equal({ additional:'ServerError' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('ServerError: server error message');
            expect(err.stack).to.match(/^ServerError\: server error message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('ServerError');
        });
    });

    describe('UserMessage', function(){
        it('should return 400 and the message and handle all arguments passed', function(){
            var err = Errors.UserMessage('user message', new Error('test error'), { additional:'UserMessage' }, 'UserMessage');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.UserMessage);
            expect(err.message).to.equal('user message');
            expect(err.safe_message).to.equal('user message');
            expect(err.status_code).to.equal(400);
            expect(err.name).to.equal('UserMessage');
            expect(err.additional).to.deep.equal({ additional:'UserMessage' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('UserMessage: user message');
            expect(err.stack).to.match(/^UserMessage\: user message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('UserMessage');
        });
    });

    describe('WarnUser', function(){
        it('should return 400 and the message and handle all arguments passed', function(){
            var err = Errors.WarnUser('warn user message', new Error('test error'), { additional:'WarnUser' }, 'WarnUser');
            
            expect(err).to.be.instanceof(Error);
            expect(err).to.be.instanceof(Errors.WarnUser);
            expect(err.message).to.equal('warn user message');
            expect(err.safe_message).to.equal('warn user message');
            expect(err.status_code).to.equal(400);
            expect(err.name).to.equal('WarnUser');
            expect(err.additional).to.deep.equal({ additional:'WarnUser' });
            expect(err.error).to.be.instanceof(Error, /^test error/);
            expect('' + err).to.equal('WarnUser: warn user message');
            expect(err.stack).to.match(/^WarnUser\: warn user message\r?\n?[^\r\n]+test-errors-default.js/);
            expect(err.field).to.equal('WarnUser');
        });
    });
});