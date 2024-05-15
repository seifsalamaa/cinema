"use strict";

var Validation = require('@typhoslabs/validation');

function expressValidation(validations, options) {
    var validation = Validation.Object(validations);
    return function (req, res, next) {
        var field;
        
        req.valid = {};
        var result = validation.validate((options && options.query ? req.query : req.body), req.valid);
        
        // replace the invalid values with the valid ones
        if(options && options.query){
            for(field in req.valid){
                req.query[field] = req.valid[field];
            }
        } else {
            for(field in req.valid){
                req.body[field] = req.valid[field];
            }
        }
        
        if (result instanceof Error){
            // need to have a sparse flag
            var bad;
            for(field in result.fields){
                if(result.fields[field]._type === 'NO_VALIDATION'){
                    delete result.fields[field];
                } else {
                    bad = true;
                }
            }
            
            // if still bad
            if(bad){
                req.invalid = result;
            }
        }
        next();
    };
}

Validation.express = expressValidation;

module.exports = Validation;