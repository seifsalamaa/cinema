"use strict";

var Chai = require('chai');
var DirtyChai = require('dirty-chai');
var expect = Chai.expect;

Chai.use(DirtyChai);

var Validation = require('../index.js');
var checkInvalid = require('./util/helper.js').checkInvalid;

describe('StringValidation', function(){
    describe('.validate()', function(){
        it('should validate a string value', function(){
            var v = Validation.String('Test string');
            
            checkInvalid(v.validate(undefined), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(null), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(true), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(false), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate({}), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate([]), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(0), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(NaN), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            checkInvalid(v.validate(Number.POSITIVE_INFINITY), v._friendly_name, 'TYPE_STRING', 'Value must be a string.');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('String!')).to.equal('String!');
        });
    });
    
    describe('.alpha()', function(){
        it('should only allow alpha characters', function(){
            var v = Validation.String('Test string').alpha();
            
            checkInvalid(v.validate('0'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            checkInvalid(v.validate('abc.ABC'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            checkInvalid(v.validate('abc ABC'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            checkInvalid(v.validate('abc\r\nABC'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            checkInvalid(v.validate('abc\bABC'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            checkInvalid(v.validate('abc\tABC'), v._friendly_name, 'ALPHA', 'Value must be only alpha characters.');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('a')).to.equal('a');
            expect(v.validate('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')).to.equal('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        });
    });
    
    describe('.alphanumeric()', function(){
        it('should only allow alphanumeric characters', function(){
            var v = Validation.String('Test string').alphanumeric();
            
            checkInvalid(v.validate('abc.ABC'), v._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
            checkInvalid(v.validate('abc ABC'), v._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
            checkInvalid(v.validate('abc\r\nABC'), v._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
            checkInvalid(v.validate('abc\bABC'), v._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
            checkInvalid(v.validate('abc\tABC'), v._friendly_name, 'ALPHANUMERIC', 'Value must be only alphanumeric characters.');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('a')).to.equal('a');
            expect(v.validate('0')).to.equal('0');
            expect(v.validate('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).to.equal('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        });
    });
    
    describe('.blacklist()', function(){
        it('should not allow any of the characters passed', function(){
            var v = Validation.String('Test string').blacklist('. \r\n\b\t');
            
            checkInvalid(v.validate('abc.ABC'), v._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed: .');
            checkInvalid(v.validate('abc ABC'), v._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed:  ');
            checkInvalid(v.validate('abc\r\nABC'), v._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed: \\r\\n');
            checkInvalid(v.validate('abc\bABC'), v._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed: \\b');
            checkInvalid(v.validate('abc\tABC'), v._friendly_name, 'CHARS_BLACKLIST', 'The following characters are not allowed: \\t');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('a')).to.equal('a');
            expect(v.validate('0')).to.equal('0');
            expect(v.validate('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).to.equal('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        });
        
        it('should throw if missing or invalid chars passed', function(){
            expect(function(){
                Validation.String('Test string').blacklist();
            }).to.throw(Error, /^StringValidation\.blacklist\(\) characters must be a string of blocked characters\.$/);
            
            expect(function(){
                Validation.String('Test string').blacklist(null);
            }).to.throw(Error, /^StringValidation\.blacklist\(\) characters must be a string of blocked characters\.$/);
            
            expect(function(){
                Validation.String('Test string').blacklist('');
            }).to.throw(Error, /^StringValidation\.blacklist\(\) characters must be a string of blocked characters\.$/);
            
            expect(function(){
                Validation.String('Test string').blacklist({});
            }).to.throw(Error, /^StringValidation\.blacklist\(\) characters must be a string of blocked characters\.$/);
            
            expect(function(){
                Validation.String('Test string').blacklist([]);
            }).to.throw(Error, /^StringValidation\.blacklist\(\) characters must be a string of blocked characters\.$/);
        });
    });
    
    describe('.email()', function(){
        it('should only allow a valid email address', function(){
            var v = Validation.String('Test string').email();
            
            checkInvalid(v.validate(''), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh@test'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh@test.'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh.test'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh@.test'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('josh@test..domain.com'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            checkInvalid(v.validate('first..last@domain.com'), v._friendly_name, 'EMAIL', 'Please enter a valid e-mail address.');
            
            expect(v.validate('josh@test.com')).to.equal('josh@test.com');
            expect(v.validate('josh@test.domain.com')).to.equal('josh@test.domain.com');
            expect(v.validate('first.last@domain.com')).to.equal('first.last@domain.com');
            expect(v.validate('first_last@domain.com')).to.equal('first_last@domain.com');
            expect(v.validate('first-last@domain.com')).to.equal('first-last@domain.com');
        });
    });
    
    describe('.enum()', function(){
        it('should require the value to match one of the values in the array passed', function(){
            var v = Validation.String('Test string').enum(['a', 'b', 'c']);
            
            checkInvalid(v.validate(''), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate('josh'), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate('A'), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate('B'), v._friendly_name, 'ENUM', 'Invalid value.');
            checkInvalid(v.validate('C'), v._friendly_name, 'ENUM', 'Invalid value.');
            
            expect(v.validate('a')).to.equal('a');
            expect(v.validate('b')).to.equal('b');
            expect(v.validate('c')).to.equal('c');
        });
        
        it('should not allow invalid arguments', function(){
            expect(function(){
                Validation.String('Test string').enum();
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum(undefined);
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum(null);
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum(false);
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum({});
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([]);
            }).to.throw(Error, /^StringValidation\.enum\(\) requires an array of enumeration strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([undefined]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([null]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([true]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([false]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([[]]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
            
            expect(function(){
                Validation.String('Test string').enum([{}]);
            }).to.throw(Error, /^StringValidation\.enum\(\) values must be strings\.$/);
        });
    });
    
    describe('.length()', function(){
        it('should require the length to be within the range given', function(){
            var v = Validation.String('Test string').length(5,7).uppercase();
            
            checkInvalid(v.validate(''), v._friendly_name, 'LENGTH_MIN', 'Must be at least 5 characters.');
            checkInvalid(v.validate('hell'), v._friendly_name, 'LENGTH_MIN', 'Must be at least 5 characters.');
            checkInvalid(v.validate('hello!!!'), v._friendly_name, 'LENGTH_MAX', 'Cannot be more than 7 characters.');
            
            expect(v.validate('hello')).to.equal('HELLO');
            expect(v.validate('Hello!')).to.equal('HELLO!');
            expect(v.validate('HELLO!!')).to.equal('HELLO!!');
        });
        
        it('should require the length to be less then a max value', function(){
            var v = Validation.String('Test string').length(7).uppercase();
            
            checkInvalid(v.validate('hello!!!'), v._friendly_name, 'LENGTH_MAX', 'Cannot be more than 7 characters.');
            
            expect(v.validate('hi')).to.equal('HI');
            expect(v.validate('HELLO!!')).to.equal('HELLO!!');
        });
        
        it('should add "s" to characters in the error message on ly when appropriate', function(){
            var v = Validation.String('Test string').length(1, 1).uppercase();
            
            checkInvalid(v.validate('hello!!!'), v._friendly_name, 'LENGTH_MAX', 'Cannot be more than 1 character.');
            checkInvalid(v.validate(''), v._friendly_name, 'LENGTH_MIN', 'Must be at least 1 character.');
            
            expect(v.validate('a')).to.equal('A');
            
            v = Validation.String('Test string').length(1).uppercase();
            
            checkInvalid(v.validate('hello!!!'), v._friendly_name, 'LENGTH_MAX', 'Cannot be more than 1 character.');
            
            expect(v.validate('a')).to.equal('A');
        });
        
        it('should not allow invalid arguments', function(){
            expect(function(){
                Validation.String('Test string').length('bad');
            }).to.throw(Error, /^ArrayValidation\.length\(\) invalid values\.$/);
            
            expect(function(){
                Validation.String('Test string').length(1, 'bad');
            }).to.throw(Error, /^ArrayValidation\.length\(\) invalid values\.$/);
            
            expect(function(){
                Validation.String('Test string').length(undefined, 1);
            }).to.throw(Error, /^ArrayValidation\.length\(\) invalid values\.$/);
            
            expect(function(){
                Validation.String('Test string').length(NaN);
            }).to.throw(Error, /^ArrayValidation\.length\(\) invalid values\.$/);
        });
    });
    
    describe('.lowercase()', function(){
        it('should convert the value to lowercase by default', function(){
            var v = Validation.String('Test string').lowercase();
            
            expect(v.validate('TeSt ThIs VALUE')).to.equal('test this value');
            expect(v.validate('VALUE')).to.equal('value');
            expect(v.validate('value')).to.equal('value');
        });
        
        it('should convert the value to lowercase by default', function(){
            var v = Validation.String('Test string').lowercase(false);
            
            checkInvalid(v.validate('BAD'), v._friendly_name, 'LOWERCASE', 'Value must be lowercase.');
            
            expect(v.validate('value')).to.equal('value');
        });
    });
    
    describe('.luhn()', function(){
        it('should check if the string passes luhn validation', function(){
            var v = Validation.String('Test string').luhn();
            
            checkInvalid(v.validate(''), v._friendly_name, 'LUHN', 'Invalid number.');
            checkInvalid(v.validate('abc'), v._friendly_name, 'LUHN', 'Invalid number.');
            
            checkInvalid(v.validate('50'), v._friendly_name, 'LUHN', 'Invalid number.');
            
            expect(v.validate('There 59 bottles of beer on the wall')).to.equal('There 59 bottles of beer on the wall');
            expect(v.validate('4111-1111-1111-1111')).to.equal('4111-1111-1111-1111');
        });
        
        it('should strip non-numeric if requested', function(){
            var v = Validation.String('Test string').luhn(true);
            
            checkInvalid(v.validate(''), v._friendly_name, 'LUHN', 'Invalid number.');
            checkInvalid(v.validate('abc'), v._friendly_name, 'LUHN', 'Invalid number.');
            
            checkInvalid(v.validate('50'), v._friendly_name, 'LUHN', 'Invalid number.');
            
            expect(v.validate('59')).to.equal('59');
            expect(v.validate('There 59 bottles of beer on the wall')).to.equal('59');
            expect(v.validate('4111-1111-1111-1111')).to.equal('4111111111111111');
        });
    });
    
    describe('.numeric()', function(){
        it('should require that the value is only numeric', function(){
            var v = Validation.String('Test string').numeric();
            
            checkInvalid(v.validate('a123'), v._friendly_name, 'NUMERIC', 'Value must be only numeric.');
            checkInvalid(v.validate('123 '), v._friendly_name, 'NUMERIC', 'Value must be only numeric.');
            checkInvalid(v.validate('a'), v._friendly_name, 'NUMERIC', 'Value must be only numeric.');
            checkInvalid(v.validate('-1'), v._friendly_name, 'NUMERIC', 'Value must be only numeric.');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('59')).to.equal('59');
            expect(v.validate('0123456789')).to.equal('0123456789');
        });
        
        it('should strip numeric if desired', function(){
            var v = Validation.String('Test string').numeric(true);
            
            expect(v.validate('a123')).to.equal('123');
            expect(v.validate('123 ')).to.equal('123');
            expect(v.validate('a')).to.equal('');
            expect(v.validate('-1')).to.equal('1');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('59')).to.equal('59');
            expect(v.validate('0123456789')).to.equal('0123456789');
        });
    });
    
    describe('.phone()', function(){
        it('should require a numeric value between 10 and 15 characters', function(){
            var v = Validation.String('Test string').phone();
            
            checkInvalid(v.validate('a123'), v._friendly_name, 'PHONE', 'Please enter a valid phone number.');
            checkInvalid(v.validate('888-5555'), v._friendly_name, 'PHONE', 'Please enter a valid phone number.');
            
            expect(v.validate('0123456789')).to.equal('0123456789');
            expect(v.validate('1 (509) 888-5555')).to.equal('15098885555');
        });
    });
    
    describe('.regex()', function(){
        it('should require a value to pass the regex test', function(){
            var v = Validation.String('Test string').regex(/hi/g);
            
            checkInvalid(v.validate(''), v._friendly_name, 'REGEX', 'Invalid format.');
            checkInvalid(v.validate('hello!'), v._friendly_name, 'REGEX', 'Invalid format.');
            
            expect(v.validate('this should work\nhi')).to.equal('this should work\nhi');
            
            // check g flag issue
            expect(v.validate('hi')).to.equal('hi');
            expect(v.validate('hi')).to.equal('hi');
            expect(v.validate('hi')).to.equal('hi');
            expect(v.validate('hi')).to.equal('hi');
        });
    });
    
    describe('.uppercase()', function(){
        it('should convert the value to uppercase by default', function(){
            var v = Validation.String('Test string').uppercase();
            
            expect(v.validate('TeSt ThIs VALUE')).to.equal('TEST THIS VALUE');
            expect(v.validate('VALUE')).to.equal('VALUE');
            expect(v.validate('value')).to.equal('VALUE');
        });
        
        it('should convert the value to uppercase by default', function(){
            var v = Validation.String('Test string').uppercase(false);
            
            checkInvalid(v.validate('bad'), v._friendly_name, 'UPPERCASE', 'Value must be uppercase.');
            
            expect(v.validate('VALUE')).to.equal('VALUE');
        });
    });
    
    describe('.trim()', function(){
        it('should trim whitespace from the beginning and end of the string', function(){
            var v = Validation.String('Test string').trim();
            
            expect(v.validate('value')).to.equal('value');
            expect(v.validate(' value')).to.equal('value');
            expect(v.validate('\tvalue')).to.equal('value');
            expect(v.validate('\rvalue')).to.equal('value');
            expect(v.validate('\nvalue')).to.equal('value');
            expect(v.validate('\fvalue')).to.equal('value');
            expect(v.validate('value ')).to.equal('value');
            expect(v.validate('value\t')).to.equal('value');
            expect(v.validate('value\r')).to.equal('value');
            expect(v.validate('value\n')).to.equal('value');
            expect(v.validate('value\f')).to.equal('value');
            expect(v.validate(' value ')).to.equal('value');
            expect(v.validate('\tvalue\t')).to.equal('value');
            expect(v.validate('\rvalue\r')).to.equal('value');
            expect(v.validate('\nvalue\n')).to.equal('value');
            expect(v.validate('\fvalue\f')).to.equal('value');
            expect(v.validate('haha\r\n\tthis works')).to.equal('haha\r\n\tthis works');
        });
        
        it('should return invalid if transform is set to false', function(){
            var v = Validation.String('Test string').trim(false);
            
            checkInvalid(v.validate(' value'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\tvalue'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\rvalue'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\nvalue'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\fvalue'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('value '), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('value\t'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('value\r'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('value\n'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('value\f'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate(' value '), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\tvalue\t'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\rvalue\r'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\nvalue\n'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            checkInvalid(v.validate('\fvalue\f'), v._friendly_name, 'TRIM', 'Value must not have whitespace before or after value.');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('hello!')).to.equal('hello!');
            expect(v.validate('haha\r\n\tthis works')).to.equal('haha\r\n\tthis works');
        });
    });
    
    describe('.whitelist()', function(){
        it('should only allow the characters passed', function(){
            var v = Validation.String('Test string').whitelist('.aeiou');
            
            checkInvalid(v.validate('abc.ABC'), v._friendly_name, 'CHARS_WHITELIST', 'The following characters are not allowed: bcABC');
            
            expect(v.validate('')).to.equal('');
            expect(v.validate('a')).to.equal('a');
            expect(v.validate('.')).to.equal('.');
            expect(v.validate('aeiou.')).to.equal('aeiou.');
        });
        
        it('should throw if missing or invalid chars passed', function(){
            expect(function(){
                Validation.String('Test string').whitelist();
            }).to.throw(Error, /^StringValidation\.whitelist\(\) characters must be a string of allowed characters\.$/);
            
            expect(function(){
                Validation.String('Test string').whitelist(null);
            }).to.throw(Error, /^StringValidation\.whitelist\(\) characters must be a string of allowed characters\.$/);
            
            expect(function(){
                Validation.String('Test string').whitelist('');
            }).to.throw(Error, /^StringValidation\.whitelist\(\) characters must be a string of allowed characters\.$/);
            
            expect(function(){
                Validation.String('Test string').whitelist({});
            }).to.throw(Error, /^StringValidation\.whitelist\(\) characters must be a string of allowed characters\.$/);
            
            expect(function(){
                Validation.String('Test string').whitelist([]);
            }).to.throw(Error, /^StringValidation\.whitelist\(\) characters must be a string of allowed characters\.$/);
        });
    });
});