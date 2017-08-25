package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.security.model.AuthenticatedUser;
import se.sjtu.formfoss.security.service.JwtUtil;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Controller
public class LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    /*
     * get the JwtUser
     */
    @PostMapping(path = "/getCredential")
    public @ResponseBody
    ResponseEntity<AuthenticatedUser> login(@RequestBody UserEntity userEntity) {
        String username = userEntity.getUserName();
        String password = userEntity.getUserPassword();
        HttpStatus status;

        if (username != null && password != null) {
            List<UserEntity> users = userRepository.findByUserNameIgnoreCase(username);
            if (users.size() == 1 && users.get(0).getUserPassword().equals(password)) {
                status = HttpStatus.OK;
                UserEntity matchedUser = users.get(0);

                System.out.printf(matchedUser.toString());

                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority(
                        matchedUser.getUserRole()
                ));
                AuthenticatedUser authenticatedUser = new AuthenticatedUser(
                        matchedUser.getUserId(),
                        matchedUser.getUserName(),
                        jwtUtil.generateToken(matchedUser),
                        authorities
                );
                return new ResponseEntity<>(authenticatedUser, status);
            }
        }

        status = HttpStatus.UNAUTHORIZED;
        return new ResponseEntity<>(status);
    }
}
