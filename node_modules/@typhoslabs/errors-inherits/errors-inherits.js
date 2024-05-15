"use strict";

module.exports = errorsInherits;

var util = require('util');

function errorsInherits(errors_base){
    // add inherits function to base
    errors_base.inherits = errorsInheritsServerSide;
    // add inheritsSuper function to base
    errors_base.inheritsSuper = true;
}

// call to make an error an instanceof another error type
function  errorsInheritsServerSide(constructor, parent){
    // going to inherit from Error
    util.inherits(constructor, parent);
}