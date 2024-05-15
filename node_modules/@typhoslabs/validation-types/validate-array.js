"use strict";

module.exports = function(Validation){

    function ArrayValidation(validation, friendly_name) {
        if (!(this instanceof ArrayValidation)) return new ArrayValidation(validation, friendly_name);
        this._initialize(friendly_name);
        
        this[0] = validation;
    }
    ArrayValidation.prototype = new Validation();

    ArrayValidation.prototype.validate = function (value, valid) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (!Array.isArray(value)) return Validation.Invalid(this._friendly_name, 'TYPE_ARRAY', 'Value must be an Array.');

        if (!this[0]){
            return this._chain(value);
        }
        var t, invalid;
        valid = valid || [];
        var validation = this[0];

        v = this._chain(value);

        if(v instanceof Validation.Invalid){
            invalid = v;
        } else {
            invalid = new Validation.Invalid(this._friendly_name, 'ARRAY_FIELDS', 'Please check the following values:');
        }

        for (var i = 0; i < value.length; i++) {
            t = undefined;
            
            if(validation instanceof Validation.Object){
                t = {};
            }
            else if(validation instanceof Validation.Array){
                t = [];
            }
            
            if(t){
                v = validation.validate(value[i], t);
            } else {
                v = validation.validate(value[i]);
            }
            
            if (v instanceof Validation.Invalid) {
                Validation.addError(invalid, i, v);
                
                if(t && (v._type === 'OBJECT_FIELDS' || v._type === 'ARRAY_FIELDS')){
                    valid[i] = t;
                }
            } else {
                valid[i] = v;
            }
        }
        
        if (invalid._type !== 'ARRAY_FIELDS' || invalid.fields) {
            return invalid;
        }
        
        return valid;
    };

    ArrayValidation.prototype.length = function (min, max) { // or function(max){
        if (arguments.length <= 1) {
            max = min;
            min = undefined;
        }
        // check values
        if (((typeof min !== 'number' || min < 0) && typeof min !== 'undefined') || typeof max !== 'number' || max < min) throw new Error('ArrayValidation.length() invalid values.');

        if (min > 0) {
            this._chain.add(function (value) {
                if (value.length < min) return Validation.Invalid(this._friendly_name, 'LENGTH_MIN', 'Not enough values.');
                if (value.length > max) return Validation.Invalid(this._friendly_name, 'LENGTH_MAX', 'Too many values.');
                return value;
            });
        } else {
            this._chain.add(function (value) {
                if (value.length > max) return Validation.Invalid(this._friendly_name, 'LENGTH_MAX', 'Too many values.');
                return value;
            });
        }
        return this;
    };
    
    // export
    Validation.Array = ArrayValidation;
    return ArrayValidation;
};

