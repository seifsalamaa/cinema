"use strict";

module.exports = exportFn;

// needs to export a function that is invoked in order for each script to
// use any plugin it wants
function exportFn(){
    // if set, if this module is called as a function, the arguments will just be
    // passed along to this function
    var fn;
    
    // what we will export
    function errorsBase(){
        // if there is a base fn, call it
        if(typeof fn === 'function'){
            return fn.apply(this, arguments); // jshint ignore:line
        }
        
        // otherwise, we're done here
    }
    
    // need to be able to set the fn from plugins
    errorsBase.setFn = function setErrorsBaseFn(error_fn){
        fn = error_fn;
    };
    
    // used to create a new error type
    function extendError(constructor, error_name, default_message, status_code, safe_message) {
        /*jshint validthis:true */
        
        // check for optional constructor
        if(typeof constructor !== 'function'){
            safe_message = status_code;
            status_code = default_message;
            default_message = error_name;
            error_name = constructor;
            constructor = undefined;
        }
        
        if(!constructor){
            constructor = function CustomError(message, error, additional, field, base_error) {
                // call init (only thing required for a constructor). Only passing "this" is required.
                // but everything else should probably be handled
                return constructor._init(this, message, error, additional, field, base_error);
            };
        }
        
        var parent = (this !== errorsBase ? this : Error);
        
        // do we have inheritance handling?
        if(errorsBase.inherits){
            errorsBase.inherits(constructor, parent);
        }
        
        // add an _init function for the constructor
        Object.defineProperty(constructor, '_init', {
            value: function errorInit(inst, message, error, additional, field, generic_error) {
                // HACK: We don't want to need the "new" operator but we need the error to be an instanceof
                // the constructor. So, if called without the new operator, we create a new instance and 
                // and pass something very unlikely to be passed (constructor as message) to flag that we 
                // just want it to return
                if (message === constructor) return;
                // make sure we have an instanceof this constructor
                if (!(inst instanceof constructor)) inst = new constructor(constructor);
                
                // do we call super's constructor?
                if(errorsBase.inheritsSuper){
                    parent.call(inst);
                }
                
                // set the message
                inst.message = message || default_message;
                
                // are messages passed safe?
                if (safe_message){
                    inst.safe_message = inst.message;
                }
                
                // store the original error (used to mutate errors)
                if (error){
                    inst.error = error;
                }
                
                // additional is optional and should be an object. If string, we assume it's a field
                if(typeof additional === 'string' && typeof field !== 'string'){
                    generic_error = field;
                    field = additional;
                    additional = undefined;
                }
                
                // additional information passed?
                if (additional) {
                    var addl = {};
                    inst.additional = addl;
                    for (var i in additional){
                        addl[i] = additional[i];
                    }
                }
                
                // field is optional
                if(typeof field !== 'string'){
                    generic_error = field;
                    field = undefined;
                } else {
                    inst.field = field;
                }
                
                // generic_error?
                if(generic_error){
                    inst.generic = true;
                }
                
                // do we have something for capturing stack traces?
                if(errorsBase.captureStackTrace){
                    errorsBase.captureStackTrace(inst, constructor);
                }
                
                // return this error
                return inst;
            },
            enumerable: false
        });
        
        // add default toString method
        Object.defineProperty(constructor.prototype, 'toString', {
            value: function errorToString() { 
                return this.name + ': ' + this.message; 
            },
            enumerable: false,
            configurable: true
        });
        
        // set default values
        constructor.prototype.name = error_name;
        constructor.prototype.status_code = status_code || 500;
        constructor.prototype.safe_message = default_message;
        
        // want to be able to extend this error
        constructor.extend = extendError;
        
        // return the constructor
        return constructor;
    }
    
    
    // by default, should be able to add, extend, and rebase errors
    errorsBase.add = addError;
    errorsBase.extend = extendError;
    errorsBase.rebase = rebaseError;
    
    // return our errorsBase
    return errorsBase;
}

// add an error to an existing error
function addError(base, field, err){
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
    
    var f;
    
    if(field === undefined){
        if(!err.generic){
            if(base.generic){
                return rebaseError(base, err);
            } else {
                if(!base.errors){
                    base.errors = [err];
                } else {
                    if(!~base.errors.indexOf(err)){
                        base.errors.push(err);
                    }
                }
            }
        }
        
        if(err.errors){
            for(f = 0; f < err.errors.length; f++){
                base = addError(base, err.errors[f]);
            }
        }
        
        if(err.fields){
            for(f in err.fields){
                base = addError(base, f, err.fields[f]);
            }
        }
    } else {
        if(!base.fields){
            base.fields = {};
        }
        
        if(base.fields[field]){
            if(!err.generic && base.fields[field].generic){
                base.fields[field] = rebaseError(base.fields[field], err);
            } else {
                base.fields[field] = addError(base.fields[field], err);
            }
        } else {
            base.fields[field] = err;
        }
        
        if(err.fields){
            for(f in err.fields){
                base = addError(base, field + '.' + f, err.fields[f]);
            }
        }
    }
    
    return base;
}

// to set a new error as the base and add the old one as a child
function rebaseError(base, err){
    // strip the errors and fields
    var errors, fields, field;
    
    if(err.errors){
        errors = err.errors;
        delete err.errors;
    }
    
    if(err.fields){
        fields = err.fields;
        delete err.fields;
    }
    
    // add base to err
    err = addError(err, base);
    
    // now add the errors back
    if(errors){
        err.errors = err.errors.concat(errors);
    }
    
    // and add the fields back
    if(fields){
        for(field in fields){
            err = addError(err, field, fields[field]);
        }
    }
    
    return err;
}