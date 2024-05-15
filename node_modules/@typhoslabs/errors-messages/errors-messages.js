"use strict";

module.exports = function(errors_base){
    

    // add the messages class
    errors_base.Message = ErrorMessage;

    // function for getting all error messages as an easy-to-use object
    errors_base.messages = function(error){
        if(error === undefined || error === null){
            return undefined;
        }
        return new ErrorMessage(error);
    };
};

function ErrorMessage(invalid, subfields){
    // check for invalid message
    if(typeof invalid === 'string'){
        // set the message and return
        this._ = invalid;
        return;
    }
    
    if(arguments.length === 1){
        subfields = true;
    }
    
    // it's an invalid object if we're here
    
    var fields = invalid.fields;
    
    Object.defineProperty(this, "_", {
        value: invalid.message,
        enumerable: false
    });
    
    if(!fields || !subfields){
        return;
    }
    
    var field, path, parent, value, level;
    
    for(path in fields){
        value = fields[path];
        path = path.split('.');
        parent = this;
        level = '';
        
        while(path.length > 1){
            field = path.shift();
            if(!parent[field]){
                if(fields[level + field]){
                    parent[field] = new ErrorMessage(fields[level + field], false);
                } else {
                    parent[field] = new ErrorMessage('Please check your input:');
                }
            }
            parent = parent[field];
            level += field + '.';
        }
        
        field = path[0];
        
        if(!parent[field]){
            parent[field] = new ErrorMessage(value, false);
        }
    }
}

Object.defineProperty(ErrorMessage.prototype, 'toString', {
    value: function(){
        return this._ || "[unknown error]";
    },
    enumerable: false
});