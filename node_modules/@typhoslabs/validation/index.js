/* compilation of validation modules for server-side */

// start with the base
var Validation = require('@typhoslabs/validation-base')();

// add plugins
require('@typhoslabs/validation-invalid')(Validation);
require('@typhoslabs/validation-invalid-error')(Validation);
require('@typhoslabs/validation-types')(Validation);

// and export
module.exports = Validation;
