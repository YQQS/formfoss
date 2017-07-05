package se.sjtu.formfoss.exception;

import org.springframework.http.ResponseEntity;

/**
 * Created by Administrator on 2017/7/3.
 */
public class UserNotFoundException extends RuntimeException{
    private int userId;
    public UserNotFoundException(int userId){
        this.userId=userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}