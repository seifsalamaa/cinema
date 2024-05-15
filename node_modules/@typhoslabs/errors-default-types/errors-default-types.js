"use strict";

module.exports = function(errors_base){
    errors_base.AuthError = AuthError;
    errors_base.NotFoundError = NotFoundError;
    errors_base.UserError = UserError;
    errors_base.NotifyUser = NotifyUser;
    errors_base.HTTPRequestError = HTTPRequestError;
    errors_base.DevError = DevError;
    errors_base.ServerError = ServerError;
    errors_base.UserMessage = UserMessage;
    errors_base.WarnUser = WarnUser;
    
    // extend all errors
    errors_base.extend(AuthError, 'AuthError', 'Authorization required.', 401);
    errors_base.extend(NotFoundError, 'NotFoundError', 'Not found.', 404);
    errors_base.extend(UserError, 'UserError', 'Please check your values.', 400, true);
    errors_base.extend(NotifyUser, 'NotifyUser', 'A server error occurred.', 500, true);
    errors_base.extend(HTTPRequestError, 'HTTPRequestError', 'Bad response from server.', 500);
    errors_base.extend(DevError, 'DevError', 'Bad setup on server.', 500);
    errors_base.extend(ServerError, 'ServerError', 'Server error occurred.', 500);
    errors_base.extend(UserMessage, 'UserMessage', 'Success.', 400, true);
    errors_base.extend(WarnUser, 'WarnUser', 'Request successful but needs review.', 400, true);
};

// session timed out or use doesn't have permission
function AuthError(message, error, additional, field, base_error){
    return AuthError._init(this, message, error, additional, field, base_error);
}


// resource was not found
function NotFoundError(message, error, additional, field, base_error){
    return NotFoundError._init(this, message, error, additional, field, base_error);
}


// user submitted invalid information
function UserError(message, error, additional, field, base_error){
    return UserError._init(this, message, error, additional, field, base_error);
}


// server error with a message to the user
function NotifyUser(message, error, additional, field, base_error){
    return NotifyUser._init(this, message, error, additional, field, base_error);
}


// http request error
function HTTPRequestError(message, error, additional, field, base_error){
    return HTTPRequestError._init(this, message, error, additional, field, base_error);
}


// developer did something wrong
function DevError(message, error, additional, field, base_error){
    return DevError._init(this, message, error, additional, field, base_error);
}


// server error
function ServerError(message, error, additional, field, base_error){
    return ServerError._init(this, message, error, additional, field, base_error);
}


// user message
function UserMessage(message, error, additional, field, base_error){
    return UserMessage._init(this, message, error, additional, field, base_error);
}


// server error with a message to the user
function WarnUser(message, error, additional, field, base_error){
    return WarnUser._init(this, message, error, additional, field, base_error);
}