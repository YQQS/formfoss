package se.sjtu.formfoss.security.exception;


import org.springframework.security.core.AuthenticationException;

/*
 * Exception indicate the token is invalid
 */
public class JwtTokenMalformedException extends AuthenticationException {
    public JwtTokenMalformedException(String msg) {
        super(msg);
    }
}
