"use strict";

module.exports = function(Validation){

    function DateValidation(friendly_name) {
        if (!(this instanceof DateValidation)) return new DateValidation(friendly_name);
        this._initialize(friendly_name);
    }

    DateValidation.prototype = new Validation();

    DateValidation.prototype.validate = function (value) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (!(value instanceof Date)) {
            if (typeof value === 'string') value = new Date(value);
            else if (typeof value === 'number') value = new Date(value);
            if (!(value instanceof Date) || isNaN(value.getTime())) return Validation.Invalid(this._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
        }
        if (value === 'Invalid Date' || value.toString() === 'Invalid Date') return Validation.Invalid(this._friendly_name, 'TYPE_DATE', 'Value must be a valid date.');
        return this._chain(value);
    };

    DateValidation.prototype.range = function (min, max) { // jshint ignore:line
        var args = Array.prototype.splice.call(arguments, 0);
        var i;
        
        if (args.length % 2 !== 0 || args.length === 0){
            throw new Error('DateValidation.range() missing argument.');
        }
        
        for (i = 0; i < args.length; i++) {
            var v = DateValidation().validate(args[i]);
            
            if (v instanceof Validation.Invalid){
                throw new Error('DateValidation.range() invalid date argument.');
            }
            
            // convert to ms
            args[i] = v.getTime();
        }
        
        // make sure all the mins are less than the maxs
        for(i = 0; i < args.length; i += 2){
            if(args[i] > args[i+1]){
                throw new Error('DateValidation.range() min value is greater than max value.');
            }
        }
        
        this._chain.add(function (value) {
            // convert to ms
            var v = value.getTime();
            
            for (var i = 0; i < args.length; i += 2){
                if (v >= args[i] && v <= args[i + 1]){
                    return value;
                }
            }
            
            return Validation.Invalid(this._friendly_name, 'RANGE', 'Value outside allowed range' + (args.length > 2 ? 's' : '') + '.');
        });
        
        return this;
    };

    DateValidation.prototype.before = function(time, friendly_before){
        if(time === 'now'){
            friendly_before = friendly_before || 'in the past';
            
            this._chain.add(function(value){
                if(value.getTime() >= Date.now()){
                    return Validation.Invalid(this._friendly_name, 'TIME_BEFORE', 'Value must be ' + friendly_before + '.');
                }
                return value;
            });
            
            return this;
        }
        
        if((time = DateValidation().validate(time)) instanceof Validation.Invalid){
            throw new Error('DateValidation.before() invalid time argument.');
        }
        
        friendly_before = friendly_before || 'before ' + time.toISOString();
        time = time.getTime();
        
        this._chain.add(function(value){
            if(value.getTime() >= time){
                return Validation.Invalid(this._friendly_name, 'TIME_BEFORE', 'Value must be ' + friendly_before + '.');
            }
            return value;
        });
        
        return this;
    };

    DateValidation.prototype.after = function(time, friendly_after){
        if(time === 'now'){
            this._chain.add(function(value){
                friendly_after = friendly_after || 'in the future';
            
                if(value.getTime() < Date.now()){
                    return Validation.Invalid(this._friendly_name, 'TIME_AFTER', 'Value must be ' + friendly_after + '.');
                }
                return value;
            });
            
            return this;
        }
        
        if((time = DateValidation().validate(time)) instanceof Validation.Invalid){
            throw new Error('DateValidation.after() invalid time argument.');
        }
        
        friendly_after = friendly_after || 'after ' + time.toISOString();
        time = time.getTime();
        
        this._chain.add(function(value){
            if(value.getTime() < time){
                return Validation.Invalid(this._friendly_name, 'TIME_AFTER', 'Value must be ' + friendly_after + '.');
            }
            return value;
        });
        
        return this;
    };
    
    // export
    Validation.Date = DateValidation;
    return DateValidation;
};