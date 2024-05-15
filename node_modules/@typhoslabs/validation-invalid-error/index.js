"use strict";

// simply makes it so that Validation.Invalid instances are also instanceof Error

// need server-side errors
var Errors = require('super-errors');

module.exports = function(Validation){
    if(!Validation || !Validation.Invalid){
        throw new Error('validation-base and Validation.Invalid are needed before validation-invalid-error can work its magic.');
    }
    
    // yep, that easy
    Errors.extend(Validation.Invalid, 'Invalid', 'Invalid information sent.', 400, true);

    // override the default toString()
    Object.defineProperty(Validation.Invalid.prototype, 'toString', {
        value: function () {
            var s = this.message || '[no message]';
            var fields = this.fields;
            var field;
            
            if(fields){
                for (field in fields) {
                    s += '\r\n\t' + (fields[field]._friendly_name || field) + ': ' + Errors.safeMessage(fields[field]);
                }
            }
            return s;
        },
        enumerable: false,
        configurable: true
    });
    
    // override the Validation.addError() function
    Validation.addError = function(){
        return Errors.add.apply(undefined, arguments);
    };
};
 