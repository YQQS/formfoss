package se.sjtu.formfoss.security.exception;

import org.springframework.security.core.AuthenticationException;

/*
 * Exception indicate the token is missing
 */
public class JwtTokenMissingException extends AuthenticationException {

    public JwtTokenMissingException(String msg) {
        super(msg);
    }
}
