"use strict";

var ValidationChain = require('./validation-chain.js');

module.exports = function(){

    var fn;
    
    // Validation class
    function Validation(){
        // if there is a base fn, call it
        if(typeof fn === 'function'){
            return fn.apply(this, arguments); // jshint ignore:line
        }
        
        // otherwise, we're done here
    }

    Validation.setFn = function setBaseFn(base_fn){
        fn = base_fn;
    };

    /*** Prototype methods *****************************************************************/

    Validation.prototype._initialize = function(friendly_name){
        Object.defineProperty(this, '_friendly_name', {
            value: friendly_name,
            enumerable: false
        });
        
        Object.defineProperty(this, '_chain', {
            value: Validation.Chain(),
            enumerable: false
        });
    };

    Validation.prototype.conditional = function () { 
        var self = this;
        
        this._required = function conditionalHandler(value) {
            if (value === undefined || value === null || value === ''){
                return undefined;
            }
            return Validation.Invalid(self._friendly_name, 'CONDITIONAL', 'This field should not be set.');
        };
        
        return this; 
    };

    Validation.prototype.optional = function () {
        
        this._required = function optionalHandler(value) {
            if (value === undefined || value === null || value === ''){
                return undefined;
            }
            return value;
        };
        
        return this; 
    };

    Validation.prototype.required = function () { 
        var self = this;
        
        this._required = function requiredHandler(value) {
            if (value === undefined || value === null || value === ''){
                return Validation.Invalid(self._friendly_name, 'REQUIRED', 'Value is required.');
            }
            return value;
        };
        
        return this;
    };

    Validation.prototype.getValidator = function(){
        var _self = this;
        return function(value){
            return _self.validate(value);
        };
    };
    
    /*** Static methods ********************************************************************/
    
    Validation.addError = function(base, field, err){
        // field is optional
        if(arguments.length === 2){
            err = field;
            field = err.field;
        }
        
        if(base === err){
            return base;
        }
        
        if(!base || typeof base !== 'object'){
            var throwing = new Error('Cannot add error to non object');
            throwing.errors = [err];
            throw throwing;
        }
        
        if(field === undefined){
            if(!base.errors){
                base.errors = [err];
            } else {
                if(!~base.errors.indexOf(err)){
                    base.errors.push(err);
                }
            }
        } else {
            if(!base.fields){
                base.fields = {};
            }
            base.fields[field] = err;
        }
        
        return base;
    };
    
    Validation.use = function validationUse(extension){
        extension.call(undefined, Validation);
    };
    
    /*** export ****************************************************************************/
    
    // add validation chain
    Validation.use(ValidationChain);
    
    // export
    return Validation;
};