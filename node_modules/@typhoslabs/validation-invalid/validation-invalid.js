"use strict";

module.exports = function(Validation){
    
    // export
    Validation.Invalid = Invalid;
    return Invalid;
};

// Invalid value
function Invalid(friendly_name, type, message, field, generic_error) {
    // because we changed the arguments, we need to handle the hack here
    if(friendly_name === Invalid) return;
    
    // optional arguments...
    if(arguments.length === 1){
        message = friendly_name;
        type = undefined;
        friendly_name = undefined;
    }
    else if(arguments.length === 2){
        message = type;
        type = undefined;
    }
    
    var inst;
    
    if(Invalid._init){
        inst = Invalid._init(this, message, undefined, undefined, field, generic_error);
    } else {
        // no invalid-error extesion
        if(!(this instanceof Invalid)){
            inst = new Invalid(Invalid);
        } else {
            inst = this;
        }
        
        // set the message
        inst.message = message;
        // and field
        if(field){
            inst.field = field;
        }
        // and generic
        if(generic_error){
            inst.generic = generic_error;
        }
    }

    // add the type
    if(type && !inst._type){
        Object.defineProperty(inst, '_type', { value: type, enumerable: false });
    }

    // add the friendly_name
    if(friendly_name && !inst._friendly_name){
        Object.defineProperty(inst, '_friendly_name', { value: friendly_name, enumerable: false });
    }
    
    return inst;
}

// override the default toString()
Object.defineProperty(Invalid.prototype, 'toString', {
    value: function () {
        var s = this.message || '[no message]';
        var fields = this.fields;
        var field;
        
        if(fields){
            for (field in fields) {
                s += '\r\n\t' + (fields[field]._friendly_name || field) + ': ' + (fields[field].safe_message || fields[field].message);
            }
        }
        return s;
    },
    enumerable: false,
    configurable: true
});
