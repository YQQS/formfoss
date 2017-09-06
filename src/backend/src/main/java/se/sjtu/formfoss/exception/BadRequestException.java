package se.sjtu.formfoss.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException() {
        super();
    }

    public BadRequestException(String msg) {
        super(msg);
    }

    public BadRequestException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public BadRequestException(Throwable cause) {
        super(cause);
    }
}
