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

describe('DateValidation', function(){
    describe('.validate()', function(){
        it('should validate a date value', function(){
            var v = Validation.Date('Test date');
            
            checkInvalid(v.validate(undefined), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(null), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('bad'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('00/00/0000'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('13/00/1987'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('01/32/1987'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('-1/32/1987'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate('01/-1/1987'), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(new Date('00/00/0000')), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(new Date('13/00/1987')), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(new Date('01/32/1987')), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(new Date('-1/32/1987')), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            checkInvalid(v.validate(new Date('01/-1/1987')), v._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
            
            expect(v.validate(0).toISOString()).to.equal('1970-01-01T00:00:00.000Z');
            expect(v.validate('08/19/1987').toISOString()).to.equal('1987-08-19T07:00:00.000Z');
            expect(v.validate(new Date('08/19/1987')).toISOString()).to.equal('1987-08-19T07:00:00.000Z');
            expect(v.validate(new Date('01/01/2000')).toISOString()).to.equal('2000-01-01T08:00:00.000Z');
        });
        
        it('should work with reqired and optional', function(){
            var v = Validation.Date('Test date').required();
            checkInvalid(v.validate(), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(undefined), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(null), v._friendly_name, 'REQUIRED', 'Value is required.');
            checkInvalid(v.validate(''), v._friendly_name, 'REQUIRED', 'Value is required.');
            expect(v.validate(new Date('08/19/1987')).toISOString()).to.eql('1987-08-19T07:00:00.000Z');
            
            v = Validation.Date('Test date').optional();
            expect(v.validate()).to.eql(undefined);
            expect(v.validate(undefined)).to.eql(undefined);
            expect(v.validate(null)).to.eql(undefined);
            expect(v.validate('')).to.eql(undefined);
            expect(v.validate(new Date('08/19/1987')).toISOString()).to.eql('1987-08-19T07:00:00.000Z');
        });
    });
    
    describe('.range()', function(){
        it('should check if the value is true', function(){
            expect(function(){
                Validation.Date('Test date').range();
            }).to.throw(Error, /^DateValidation\.range\(\) missing argument\.$/);
            
            expect(function(){
                Validation.Date('Test date').range(new Date());
            }).to.throw(Error, /^DateValidation\.range\(\) missing argument\.$/);
            
            expect(function(){
                Validation.Date('Test date').range('bad', 'still bad');
            }).to.throw(Error, /^DateValidation\.range\(\) invalid date argument\.$/);
            
            expect(function(){
                Validation.Date('Test date').range(new Date(), new Date(0));
            }).to.throw(Error, /^DateValidation\.range\(\) min value is greater than max value\.$/);
            
            expect(function(){
                Validation.Date('Test date').range(new Date('01/00/0100'), new Date(0), new Date());
            }).to.throw(Error, /^DateValidation\.range\(\) missing argument\.$/);
            
            var now = new Date();
            var v = Validation.Date('Test date').range(new Date(0), now);
            
            checkInvalid(v.validate('01/01/0100'), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            checkInvalid(v.validate('01/01/3000'), v._friendly_name, 'RANGE', 'Value outside allowed range.');
            
            expect(v.validate(0).toISOString()).to.equal("1970-01-01T00:00:00.000Z");
            expect(v.validate(now).toISOString()).to.equal(now.toISOString());
            expect(v.validate(new Date('08/19/1987')).toISOString()).to.equal('1987-08-19T07:00:00.000Z');
            
            v = Validation.Date('Test date').range(new Date(0), now, new Date("01/01/3000"), new Date("01/01/4000"));
            
            checkInvalid(v.validate('01/01/0100'), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate('01/01/2500'), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            checkInvalid(v.validate('01/01/4500'), v._friendly_name, 'RANGE', 'Value outside allowed ranges.');
            
            expect(v.validate(0).toISOString()).to.equal("1970-01-01T00:00:00.000Z");
            expect(v.validate(now).toISOString()).to.equal(now.toISOString());
            expect(v.validate(new Date('08/19/1987')).toISOString()).to.equal('1987-08-19T07:00:00.000Z');
        });
    });
    
    describe('.before()', function(){
        it('should check if time is before a given time', function(){
            var v = Validation.Date().before(0);
            
            checkInvalid(v.validate('01/01/1970 12:00:01'), v._friendly_name, 'TIME_BEFORE', 'Value must be before 1970-01-01T00:00:00.000Z.');
            
            expect(v.validate(-1).toISOString()).to.equal('1969-12-31T23:59:59.999Z');
        });
        it('should allow special argument "now"', function(){
            var v = Validation.Date().before("now");
            
            checkInvalid(v.validate('01/01/3000'), v._friendly_name, 'TIME_BEFORE', 'Value must be in the past.');
            
            expect(v.validate(-1).toISOString()).to.equal('1969-12-31T23:59:59.999Z');
        });
        it('should use a friendly time in the error if passed', function(){
            var v = Validation.Date().before(0, 'before the epoch');
            
            checkInvalid(v.validate('01/01/1970 12:00:01'), v._friendly_name, 'TIME_BEFORE', 'Value must be before the epoch.');
            
            expect(v.validate(-1).toISOString()).to.equal('1969-12-31T23:59:59.999Z');
        });
        it('should use a friendly time in the error if passed and the argument is "now"', function(){
            var v = Validation.Date().before('now', 'before now');
            
            checkInvalid(v.validate('01/01/3000'), v._friendly_name, 'TIME_BEFORE', 'Value must be before now.');
            
            expect(v.validate(-1).toISOString()).to.equal('1969-12-31T23:59:59.999Z');
        });
        it('should not allow invalid arguments', function(){
            expect(function(){
                Validation.Date().before('bad');
            }).to.throw(Error, /^DateValidation\.before\(\) invalid time argument\.$/);
        });
    });
    
    describe('.after()', function(){
        it('should check if time is after a given time', function(){
            var v = Validation.Date().after(0);
            
            checkInvalid(v.validate('12/31/1969'), v._friendly_name, 'TIME_AFTER', 'Value must be after 1970-01-01T00:00:00.000Z.');
            
            expect(v.validate(1).toISOString()).to.equal('1970-01-01T00:00:00.001Z');
        });
        it('should allow special argument "now"', function(){
            var v = Validation.Date().after("now");
            
            checkInvalid(v.validate('12/31/1969'), v._friendly_name, 'TIME_AFTER', 'Value must be in the future.');
            
            expect(v.validate('01/01/3000').toISOString()).to.equal('3000-01-01T08:00:00.000Z');
        });
        it('should use a friendly time in the error if passed', function(){
            var v = Validation.Date().after(0, 'after the epoch');
            
            checkInvalid(v.validate('01/01/1969'), v._friendly_name, 'TIME_AFTER', 'Value must be after the epoch.');
            
            expect(v.validate(1).toISOString()).to.equal('1970-01-01T00:00:00.001Z');
        });
        it('should use a friendly time in the error if passed and the argument is "now"', function(){
            var v = Validation.Date().after('now', 'after now');
            
            checkInvalid(v.validate('01/01/1970'), v._friendly_name, 'TIME_AFTER', 'Value must be after now.');
            
            expect(v.validate('01/01/3000').toISOString()).to.equal('3000-01-01T08:00:00.000Z');
        });
        it('should not allow invalid arguments', function(){
            expect(function(){
                Validation.Date().after('bad');
            }).to.throw(Error, /^DateValidation\.after\(\) invalid time argument\.$/);
        });
    });
});