"use strict";

module.exports = function(Validation){
    function EnumValidation(enums, friendly_name) {
        if (!(this instanceof EnumValidation)){
            return new EnumValidation(enums, friendly_name);
        }
        
        if(!Array.isArray(enums) || enums.length === 0){
            throw new Error('EnumValidation() requires an array of enumeration values.');
        }
        
        this._initialize(friendly_name);
        
        Object.defineProperty(this, '_allowed', {
            value: enums
        });
    }

    EnumValidation.prototype = new Validation();

    EnumValidation.prototype.validate = function (value) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (!this._allowed || !~this._allowed.indexOf(value)){
            return Validation.Invalid(this._friendly_name, 'ENUM', 'Invalid value.');
        }
        
        return this._chain(value);
    };
    
    // export
    Validation.Enum = EnumValidation;
    return EnumValidation;
};