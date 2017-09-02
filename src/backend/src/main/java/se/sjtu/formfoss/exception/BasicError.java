package se.sjtu.formfoss.exception;

import org.springframework.http.HttpStatus;

/**
 * Created by Administrator on 2017/7/3.
 */
public class BasicError {
    private int code;
    private String message;

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
