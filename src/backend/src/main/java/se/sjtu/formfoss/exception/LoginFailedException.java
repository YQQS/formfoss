package se.sjtu.formfoss.exception;

public class LoginFailedException extends RuntimeException {
    public LoginFailedException() {
        super();
    }

    public LoginFailedException(String msg) {
        super(msg);
    }

    public LoginFailedException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public LoginFailedException(Throwable cause) {
        super(cause);
    }

}
