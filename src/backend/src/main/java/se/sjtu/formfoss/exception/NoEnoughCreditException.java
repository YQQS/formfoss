package se.sjtu.formfoss.exception;

/**
 * Created by 86506 on 2017/9/11.
 */
public class NoEnoughCreditException extends RuntimeException{
    public NoEnoughCreditException() {
        super();
    }

    public NoEnoughCreditException(String msg) {
        super(msg);
    }

    public NoEnoughCreditException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public NoEnoughCreditException(Throwable cause) {
        super(cause);
    }
}
