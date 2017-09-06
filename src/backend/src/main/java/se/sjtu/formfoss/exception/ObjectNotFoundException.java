package se.sjtu.formfoss.exception;

public class ObjectNotFoundException extends RuntimeException {
    public ObjectNotFoundException() {
        super();
    }

    public ObjectNotFoundException(String msg) {
        super(msg);
    }

    public ObjectNotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public ObjectNotFoundException(Throwable cause) {
        super(cause);
    }
}
