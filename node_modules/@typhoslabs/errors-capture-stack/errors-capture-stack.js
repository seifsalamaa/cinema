"use strict";

module.exports = function(errors_base){
    errors_base.captureStackTrace = function(inst, constructor){
        // simply call the method on error
        Error.captureStackTrace(inst, constructor);
    };
};