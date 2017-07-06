package se.sjtu.formfoss.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Created by Administrator on 2017/7/3.
 */
public class GlobalException extends RuntimeException{
    private HttpStatus status;

    public GlobalException(HttpStatus status){
        this.status=status;
    }
    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
