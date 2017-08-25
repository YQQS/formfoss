package se.sjtu.formfoss.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.AbstractUserDetailsAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.security.exception.JwtTokenMalformedException;
import se.sjtu.formfoss.security.model.AuthenticatedUser;
import se.sjtu.formfoss.security.model.JwtAuthToken;

import java.util.List;

@Component
public class JwtAuthProvider extends AbstractUserDetailsAuthenticationProvider {
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean supports(Class<?> authentication) {
        return (JwtAuthToken.class.isAssignableFrom(authentication));
    }

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken authentication)
        throws AuthenticationException {

    }

    @Override
    protected UserDetails retrieveUser(String username, UsernamePasswordAuthenticationToken authenticationToken)
        throws AuthenticationException {

        JwtAuthToken jwtAuthToken = (JwtAuthToken) authenticationToken;
        String token = jwtAuthToken.getToken();

        UserEntity parsedUser = jwtUtil.parseToken(token);

        if (parsedUser == null) {
            throw  new JwtTokenMalformedException("JWT Token invalid");
        }

        List<GrantedAuthority> authorityList = AuthorityUtils.commaSeparatedStringToAuthorityList(parsedUser.getUserRole());
        return new AuthenticatedUser(parsedUser.getUserId(), parsedUser.getUserName(), token, authorityList);
    }
}