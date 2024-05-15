"use strict";

module.exports = function(Validation){

    // attach the default validation types to the base
    require('./validate-array.js')(Validation);
    require('./validate-boolean.js')(Validation);
    require('./validate-date.js')(Validation);
    require('./validate-enum.js')(Validation);
    require('./validate-number.js')(Validation);
    require('./validate-object.js')(Validation);
    require('./validate-string.js')(Validation);
};