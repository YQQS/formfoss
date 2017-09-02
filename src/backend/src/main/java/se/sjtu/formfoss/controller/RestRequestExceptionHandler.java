package se.sjtu.formfoss.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.util.RestResponseUtil;

@ControllerAdvice
public class RestRequestExceptionHandler {

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<BasicError> UserNotFound(GlobalException e){
        BasicError error=new BasicError();
        error.setCode(404);
        error.setMessage("User not found");
        return new ResponseEntity<>(error,e.getStatus());
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
            errorMsg = RestResponseUtil.errorMsg("Bad Request" + ex.getMessage());
        } else {
            errorMsg = RestResponseUtil.errorMsg("Bad Request");
        }

        return new ResponseEntity<>(errorMsg, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(value = {ObjectNotFoundException.class})
    public ResponseEntity<Object> handleObjectNotFound(RuntimeException ex) {
        String errorMsg = "Object Not Found";
        if (ex.getMessage() != null) {
            errorMsg = errorMsg + ": " + ex.getMessage();
        }

        return new ResponseEntity<>(errorMsg, HttpStatus.NOT_FOUND);
    }
}
