package se.sjtu.formfoss.exception;

/**
 * Created by Administrator on 2017/7/3.
 */
public class UserAlreadyExistsException extends RuntimeException{
    private int userId;
    public UserAlreadyExistsException(int userId){
        this.userId=userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }
}
