"use strict";

module.exports = function(Validation){

    function BooleanValidation(friendly_name) {
        if (!(this instanceof BooleanValidation)) return new BooleanValidation(friendly_name);
        this._initialize(friendly_name);
    }
    BooleanValidation.prototype = new Validation();

    BooleanValidation.prototype.validate = function (value) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        switch (typeof value) {
            case 'boolean': 
                return this._chain(value);
            case 'string':
                var v = value.trim().toLowerCase();
                if (v === "false") return false;
                if (v === "true") return true;
                break;
            case 'number':
                if(value === -1 || value === 0 || value === 1){
                    return ( value === 1 );
                } 
        }
        
        return Validation.Invalid(this._friendly_name, 'TYPE_BOOLEAN', 'Value must be boolean.');
    };

    BooleanValidation.prototype.true = function () {
        this._chain.add(function(value){
            if(!value){
                return Validation.Invalid(this._friendly_name, 'TRUE', 'Value must be true.');
            }
            return true;
        });
        return this;
    };

    BooleanValidation.prototype.false = function () {
        this._chain.add(function(value){
            if(value){
                return Validation.Invalid(this._friendly_name, 'FALSE', 'Value must be false.');
            }
            return false;
        });
        return this;
    };
    
    // export
    Validation.Boolean = BooleanValidation;
    return BooleanValidation;
};