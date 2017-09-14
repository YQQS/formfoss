package se.sjtu.formfoss.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.util.RestResponseUtil;

@ControllerAdvice
public class RestRequestExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Object> UserNotFound(){
        return new ResponseEntity<>(RestResponseUtil.errorMsg("user not found"), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {PermissionDenyException.class})
    public ResponseEntity<Object> handlePermissionDeny(RuntimeException ex) {
        String errorMsg;
        if (ex.getMessage() != null) {
            errorMsg = RestResponseUtil.errorMsg("Permission deny, " + ex.getMessage());
        } else {
            errorMsg = RestResponseUtil.errorMsg("Permission Deny");
        }

        return new ResponseEntity<>(errorMsg, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = {BadRequestException.class})
    public ResponseEntity<Object> handleBadRequest(RuntimeException ex) {
        String errorMsg;
        if (ex.getMessage() != null) {
            errorMsg = RestResponseUtil.errorMsg(ex.getMessage());
        } else {
            errorMsg = RestResponseUtil.errorMsg("Bad Request");
        }

        return new ResponseEntity<>(errorMsg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ObjectNotFoundException.class, ListNotFoundException.class})
    public ResponseEntity<Object> handleObjectNotFound(RuntimeException ex) {
        String msg = "";
        if (ex.getMessage() != null) {
            msg = msg + ex.getMessage();
        }

        return new ResponseEntity<>(RestResponseUtil.errorMsg(msg), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = {LoginFailedException.class})
    public ResponseEntity<Object> handleLoginFailed(RuntimeException ex) {
        String msg = "Login failed";
        if (ex.getMessage() != null) {
            msg += (": " + ex.getMessage());
        }

        return new ResponseEntity<>(RestResponseUtil.errorMsg(msg), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = {InnerServerErrorException.class})
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleInnerServerError(RuntimeException ex) {
        String msg = "Internal Service Error";
        if (ex.getMessage() != null) {
            msg += (": " + ex.getMessage());
        }
        return RestResponseUtil.errorMsg(msg);
    }

    @ExceptionHandler(value = {NoEnoughCreditException.class})
    public ResponseEntity<Object> handleNotEnoughCredit(RuntimeException ex){
        String msg = "No enough credit ";
        if(ex.getMessage() != null) {
            msg += (": " + ex.getMessage());
        }
        return new ResponseEntity<>(RestResponseUtil.errorMsg(msg),HttpStatus.FORBIDDEN);
    }

}
