package se.sjtu.formfoss.security.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JwtAuthSuccessHandler implements AuthenticationSuccessHandler {

    /*
     * handle successfully authorized request
     * simply pass ( do nothing )
     */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication auth) {
        // do nothing
    }
}
