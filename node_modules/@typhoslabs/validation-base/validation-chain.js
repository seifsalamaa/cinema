"use strict";

module.exports = function(Validation){
    function ValidationChain() {
        
        var chain = [];

        var chain_check = function (value) {
            // need to test value against each function in the chain
            for (var i = 0; i < chain.length; i++) {
                value = chain[i].call(this, value);
                if (value instanceof Validation.Invalid) return value;
            }
            
            // return the result
            return value;
        };

        chain_check.add = function (fn) { 
            chain.push(fn); 
        };
        
        chain_check.has = function(fn) {
            return !!~chain.indexOf(fn);
        };

        return chain_check;
    }
    
    // export
    Validation.Chain = ValidationChain;
    return ValidationChain;
};