package se.sjtu.formfoss.exception;

public class InnerServerErrorException extends RuntimeException {
    public InnerServerErrorException() {
        super();
    }

    public InnerServerErrorException(String msg) {
        super(msg);
    }

    public InnerServerErrorException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public InnerServerErrorException(Throwable cause) {
        super(cause);
    }
}
