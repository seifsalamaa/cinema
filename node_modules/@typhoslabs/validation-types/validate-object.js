"use strict";

module.exports = function(Validation){

    function ObjectValidation(validations, friendly_name) {
        if (!(this instanceof ObjectValidation)) return new ObjectValidation(validations, friendly_name);
        this._initialize(friendly_name);
        
        if(!validations || Object.keys(validations).length === 0){
            // go with lenient by default if no defined fields
            this.lenient();
        } else {
            for(var field in validations){
                if(field.length === 0 || ((field.charAt(0) === '_' && field !== "_id" && field !== "__v")) || ~field.indexOf('.')){
                    throw new Error('ObjectValidation field cannot be null, begin with an underscore, or contain a period.');
                }
                
                this[field] = validations[field];
            }
        }
    }

    ObjectValidation.prototype = new Validation();

    ObjectValidation.prototype.validate = function (value, valid) {
        var v, invalid;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return new Validation.Invalid(this._friendly_name, 'TYPE_OBJECT', 'Value must be an object.');
        }

        v = this._chain(value);

        if(v instanceof Validation.Invalid){
            invalid = v;
        } else {
            invalid = new Validation.Invalid(this._friendly_name, 'OBJECT_FIELDS', 'Please check the following values:');
        }

        var t, validation, field;
        valid = valid || {};

        for (field in this) {
            if(!this.hasOwnProperty(field) || field === '_required'){
                continue;
            }
            
            validation = this[field];
            
            t = undefined;
            
            if(validation instanceof Validation.Object){
                t = {};
            }
            else if(validation instanceof Validation.Array){
                t = [];
            }
            
            if(t){
                v = validation.validate(value[field], t);
            } else {
                v = validation.validate(value[field]);
            }
            
            if (v instanceof Validation.Invalid) {
                Validation.addError(invalid, field, v);
                
                if(t && (v._type === 'OBJECT_FIELDS' || v._type === 'ARRAY_FIELDS')){
                    valid[field] = t;
                }
            } else {
                valid[field] = v;
            }
        }

        if(!this._chain.has(lenient) || this._chain.has(strict)){
            for (field in value){
                if (field in this && this.hasOwnProperty(field)){
                    continue;
                }
                
                Validation.addError(invalid, field, Validation.Invalid(field, 'NO_VALIDATION', 'Field has no validation defined.'));
            }
        } else {
            for(field in value){
                if(field in valid || !value.hasOwnProperty(field)){
                    continue;
                }
                
                valid[field] = value[field];
            }
        }

        if (invalid.fields){
            return invalid;
        }
        
        return valid;
    };

    ObjectValidation.prototype.lenient = function () {
        if(!this._chain.has(lenient) && !this._chain.has(strict)){
            this._chain.add(lenient);
        }
        return this;
    };

    ObjectValidation.prototype.strict = function () {
        this._chain.add(strict);
        return this;
    };
    
    // export
    Validation.Object = ObjectValidation;
    return ObjectValidation;
};

function lenient(value){
    // return the value. Just by having the function in the chain, it will be lenient
    return value;
}

function strict(value){
    // return the value. Just by having the function in the chain, it will be strict
    return value;
}