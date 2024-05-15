"use strict";

var Chai = require('chai');
var expect = Chai.expect;
var Validation = require('../../index.js');

module.exports.checkInvalid = function checkInvalid(val, friendly, type, message){
    expect(val).to.be.instanceof(Validation.Invalid);
    expect(val._friendly_name).to.equal(friendly);
    expect(val._type).to.equal(type);
    expect(val.message).to.equal(message);
};