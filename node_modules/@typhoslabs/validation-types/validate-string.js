"use strict";

var regex_alpha = /^[a-zA-Z]*$/;
var regex_alphanumeric = /^[a-zA-Z0-9]*$/;
var regex_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var regex_numeric = /^[0-9]*$/;

module.exports = function(Validation){

    function StringValidation(friendly_name) {
        if (!(this instanceof StringValidation)){
            return new StringValidation(friendly_name);
        }
        
        this._initialize(friendly_name);
    }

    StringValidation.prototype = new Validation();

    StringValidation.prototype.validate = function (value) {
        var v;
        
        if(this._required && ((v = this._required(value)) instanceof Validation.Invalid || v === undefined)){
            return v;
        }
        
        if (typeof value !== 'string'){
            return Validation.Invalid(this._friendly_name, 'TYPE_STRING', 'Value must be a string.');
        }
        
        return this._chain(value);
    };

    StringValidation.prototype.alpha = function () {
        this._chain.add(function (value) {
            if (regex_alpha.test(value)) return value;
            return Validation.Invalid(this._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
        });
        return this;
    };

    StringValidation.prototype.alphanumeric = function () {
        this._chain.add(function (value) {
            if (regex_alphanumeric.test(value)) return value;
            return Validation.Invalid(this._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
        });
        return this;
    };

    StringValidation.prototype.blacklist = function (chars) {
        // chars needs to be a string
        if (!chars || typeof chars !== 'string') throw new Error('StringValidation.blacklist() characters must be a string of blocked characters.');
        this._chain.add(function (value) {
            var bad = '';
            var char, t;
            for (var i = 0; i < chars.length; i++) {
                char = chars.charAt(i);
                
                if (value.indexOf(char) !== -1 && bad.indexOf(char) === -1){
                    t = JSON.stringify(char);
                    bad += t.substr(1, t.length - 2);
                }
            }
            if (bad !== '') return Validation.Invalid(this._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed: ' + bad);
            return value;
        });
        return this;
    };

    StringValidation.prototype.email = function () {
        this._chain.add(function (value) {
            if (regex_email.test(value)) return value;
            return Validation.Invalid(this._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
        });
        return this;
    };

    // bracket notation neccessary for IE 7
    StringValidation.prototype['enum'] = function () {
        var enums = {};
        
        if(!Array.isArray(arguments[0]) || arguments[0].length === 0){
            throw new Error('StringValidation.enum() requires an array of enumeration strings.');
        }
        
        var args = arguments[0];
        
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] !== 'string') throw new Error('StringValidation.enum() values must be strings.');
            enums[args[i]] = true;
        }

        this._chain.add(function (value) {
            if (!enums[value]) return Validation.Invalid(this._friendly_name, 'ENUM', 'Invalid value.');
            return value;
        });
        return this;
    };

    StringValidation.prototype.length = function (min, max) {
        if (arguments.length <= 1) {
            max = min;
            min = 0;
        }
        
        // check values
        if (isNaN(min) || typeof min !== 'number' || min < 0 || isNaN(max) || typeof max !== 'number' || max < min) throw new Error('ArrayValidation.length() invalid values.');

        if (min > 0) {
            this._chain.add(function (value) {
                if (value.length < min) return Validation.Invalid(this._friendly_name, 'LENGTH_MIN', 'Must be at least ' + min + ' character' + (min > 1 ? 's' : '') + '.');
                if (value.length > max) return Validation.Invalid(this._friendly_name, 'LENGTH_MAX', 'Cannot be more than ' + max + ' character' + (max > 1 ? 's' : '') + '.');
                return value;
            });
        } else {
            this._chain.add(function (value) {
                if (value.length > max) return Validation.Invalid(this._friendly_name, 'LENGTH_MAX', 'Cannot be more than ' + max + ' character' + (max > 1 ? 's' : '') + '.');
                return value;
            });
        }
        return this;
    };

    StringValidation.prototype.lowercase = function (transform) {
        if (transform !== false) {
            this._chain.add(function (value) { return value.toLowerCase(); });
        } else {
            this._chain.add(function (value) {
                if (value !== value.toLowerCase()) return Validation.Invalid(this._friendly_name, 'LOWERCASE', 'Value must be lowercase.');
                return value;
            });
        }
        return this;
    };

    StringValidation.prototype.luhn = function (strip_nonnumeric) {
        this._chain.add(function (value) {
            var number = value.split('');
            var sum = 0;
            var even = true; // will start with opposite this value
            for (var i = number.length - 1; i >= 0; i--) {
                // must be number
                var c = number[i].charCodeAt(0);
                if (c < 48 || c > 57){
                    if(!strip_nonnumeric){
                        continue;
                    }
                    
                    number.splice(i, 1);
                    continue;
                }
                
                // get number
                var n = parseInt(number[i]);
                if ((even = !even)) {
                    n *= 2;
                    if (n > 9) n -= 9; // n = (n - 10) + 1
                }
                sum += n;
            }
            if (sum > 0 && sum % 10 === 0) return number.join('');
            return Validation.Invalid(this._friendly_name, 'LUHN', 'Invalid number.');
        });
        return this;
    };

    StringValidation.prototype.numeric = function (transform) {
        if(transform){
            this._chain.add(function (value) {
                var number = value.split('');
                for (var i = number.length - 1; i >= 0; i--) {
                    // must be number
                    var c = number[i].charCodeAt(0);
                    if (c < 48 || c > 57){
                        number.splice(i, 1);
                        continue;
                    }
                }
                return number.join('');
            });
        } else {
            this._chain.add(function (value) {
                if (regex_numeric.test(value)) return value;
                return Validation.Invalid(this._friendly_name, 'NUMERIC', 'Value must be only numeric.');
            });
        }
        return this;
    };

    StringValidation.prototype.phone = function () {
        this._chain.add(function (value) {
            value = value.replace(/\D/g, '');
            if (value.length > 15 || value.length < 10) return Validation.Invalid(this._friendly_name, 'PHONE', 'Please enter a valid phone number.');
            return value;
        });
        return this;
    };

    StringValidation.prototype.regex = function (regex) {
        this._chain.add(function (value) {
            // reset the position (should fix g flag issue)
            regex.lastIndex = 0;
            if (!regex.test(value)) return Validation.Invalid(this._friendly_name, 'REGEX', 'Invalid format.');
            return value;
        });
        return this;
    };

    StringValidation.prototype.uppercase = function (transform) {
        if (transform !== false) {
            this._chain.add(function (value) { return value.toUpperCase(); });
        } else {
            this._chain.add(function (value) {
                if (value !== value.toUpperCase()) return Validation.Invalid(this._friendly_name, 'UPPERCASE', 'Value must be uppercase.');
                return value;
            });
        }
        return this;
    };

    StringValidation.prototype.trim = function (transform) {
        if(transform === false){
            this._chain.add(function (value) { 
                var t = value.trim();
                if(value !== t){
                    return Validation.Invalid(this._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
                }
                return value;
            });
        } else {
            this._chain.add(function (value) { return value.trim(); });
        }
        return this;
    };

    StringValidation.prototype.whitelist = function (chars) {
        // chars needs to be a string
        if (!chars || typeof chars !== 'string'){
            throw new Error('StringValidation.whitelist() characters must be a string of allowed characters.');
        }
        
        this._chain.add(function (value) {
            var bad = '';
            var char, t;
            for (var i = 0; i < value.length; i++) {
                char = value.charAt(i);
                
                if (!~chars.indexOf(char) && !~bad.indexOf(char)){
                    t = JSON.stringify(char);
                    bad += t.substr(1, t.length - 2);
                }
            }
            if (bad !== '') return Validation.Invalid(this._friendly_name, 'CHARS_WHITELIST', 'The following characters are not allowed: ' + bad);
            return value;
        });
        return this;
    };
    
    // export
    Validation.String = StringValidation;
    return StringValidation;
};