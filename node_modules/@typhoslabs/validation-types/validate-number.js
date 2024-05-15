"use strict";

var regex_number = /^-?[0-9]*\.?[0-9]*$/;

module.exports = function(Validation){

    function NumberValidation(friendly_name) {
        if (!(this instanceof NumberValidation)){
            return new NumberValidation(friendly_name);
        }
        
        this._initialize(friendly_name);
    }

    NumberValidation.prototype = new Validation();

    NumberValidation.prototype.validate = function (value) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (typeof value !== 'number') {
            if (typeof value === 'string') {
                v = value.trim();
                if (!v || !regex_number.test(v)) return Validation.Invalid(this._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
                value = parseFloat(v);
            }
            if (typeof value !== 'number' || isNaN(value)) return Validation.Invalid(this._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
        }
        if (isNaN(value)) return Validation.Invalid(this._friendly_name, 'TYPE_NUMBER', 'Value must be a number.');
        return this._chain(value);
    };

    NumberValidation.prototype.int = function () {
        this._chain.add(function (value) {
            if (value !== (value | 0)) return Validation.Invalid(this._friendly_name, 'INT', 'Value must be an integer.');
            return value;
        });
        return this;
    };

    NumberValidation.prototype.max = function (max) {
        this._chain.add(function (value) {
            if (value > max) return Validation.Invalid(this._friendly_name, 'MAX', 'Value too large.');
            return value;
        });
        return this;
    };

    NumberValidation.prototype.min = function (min) {
        this._chain.add(function (value) {
            if (value < min) return Validation.Invalid(this._friendly_name, 'MIN', 'Value too small.');
            return value;
        });
        return this;
    };

    NumberValidation.prototype.range = function (min, max) { // jshint ignore:line
        var args = Array.prototype.splice.call(arguments, 0);
        var i;
        
        if (args.length % 2 !== 0 || args.length === 0){
            throw new Error('NumberValidation.range() missing argument.');
        }
        
        for (i = 0; i < args.length; i++) {
            var v = NumberValidation().validate(args[i]);
            
            if (v instanceof Validation.Invalid){
                throw new Error('NumberValidation.range() invalid number argument.');
            }
            
            // convert to ms
            args[i] = v;
        }
        
        // make sure all the mins are less than the maxs
        for(i = 0; i < args.length; i += 2){
            if(args[i] > args[i+1]){
                throw new Error('NumberValidation.range() min value is greater than max value.');
            }
        }
        
        this._chain.add(function (value) {
            for (var i = 0; i < args.length; i += 2){
                if (value >= args[i] && value <= args[i + 1]){
                    return value;
                }
            }
            return Validation.Invalid(this._friendly_name, 'RANGE', 'Value outside allowed range' + (args.length > 2 ? 's' : '') + '.');
        });
        
        return this;
    };
    
    // export
    Validation.Number = NumberValidation;
    return NumberValidation;
};