package se.sjtu.formfoss.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.security.exception.JwtTokenMissingException;
import se.sjtu.formfoss.security.model.JwtAuthToken;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthFilter extends AbstractAuthenticationProcessingFilter {
    @Value("${jwt.start-pattern}")
    private String startStr;

    @Value("${jwt.header}")
    private String authHeader;

    @Autowired
    private JwtUtil jwtUtil;

    public JwtAuthFilter(String url) {
        super(new AntPathRequestMatcher(url));
    }


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) {
        String header = request.getHeader(authHeader);

        if (header == null) {
            throw new JwtTokenMissingException("No JWT token found in request headers");
        }

        if (! header.startsWith(startStr)) {
            throw new JwtTokenMissingException("No JWT token found in request headers, not start with requested string");
        }

        String authToken = header.substring(startStr.length());

        JwtAuthToken jwtAuthToken = new JwtAuthToken(authToken);

        return getAuthenticationManager().authenticate(jwtAuthToken);

    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication authentication) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authentication);

        UserEntity user = jwtUtil.parseToken(
                request.getHeader(authHeader).substring(startStr.length())
        );
        request.setAttribute("userId", user.getUserId());
        request.setAttribute("userRole", user.getUserRole());

        chain.doFilter(request, response);
    }
}
