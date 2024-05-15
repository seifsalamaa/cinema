"use strict";

var Chai = require('chai');
var expect = Chai.expect;
var Invalid;

module.exports.setInvalid = function(InvalidClass){
    Invalid = InvalidClass;
};

module.exports.checkInvalid = function checkInvalid(val, friendly, type, message){
    expect(val).to.be.instanceof(Invalid);
    expect(val._friendly_name).to.equal(friendly);
    expect(val._type).to.equal(type);
    expect(val.message).to.equal(message);
};