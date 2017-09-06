package se.sjtu.formfoss.exception;

public class ListNotFoundException extends RuntimeException {
    public ListNotFoundException() {
        super();
    }

    public ListNotFoundException(String msg) {
        super(msg);
    }

    public ListNotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public ListNotFoundException(Throwable cause) {
        super(cause);
    }
}
