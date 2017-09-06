package se.sjtu.formfoss.exception;


public class PermissionDenyException extends RuntimeException {
    public PermissionDenyException() {
        super();
    }

    public PermissionDenyException(String msg) {
        super(msg);
    }

    public PermissionDenyException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public PermissionDenyException(Throwable cause) {
        super(cause);
    }
}
