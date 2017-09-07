package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.BadRequestException;
import se.sjtu.formfoss.exception.LoginFailedException;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.security.model.AuthenticatedUser;
import se.sjtu.formfoss.security.service.JwtUtil;
import se.sjtu.formfoss.util.RestResponseUtil;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Controller
@RequestMapping(path = "${url.public}")
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

        if (username != null && password != null) {
            List<UserEntity> users = userRepository.findByUserNameIgnoreCase(username);

            if (users.size() == 1 && users.get(0).getUserPassword().equals(password)) {
                UserEntity matchedUser = users.get(0);

                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority(
                        matchedUser.getUserRole()
                ));
                AuthenticatedUser authenticatedUser = new AuthenticatedUser();
                authenticatedUser.setUsername(matchedUser.getUserName());
                authenticatedUser.setToken(jwtUtil.generateToken(matchedUser));
                authenticatedUser.setAuthorities(authorities);
                authenticatedUser.setRole(matchedUser.getUserRole());
                authenticatedUser.setUserId(matchedUser.getUserId());

                return new ResponseEntity<>(authenticatedUser, HttpStatus.OK);
            }

            throw new LoginFailedException("username or password not match");
        } else {
            throw new BadRequestException("username or password is empty");
        }

    }

    /*
     * create a new User from signup page
     */
    @RequestMapping(path = "/signup", method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> signup(@RequestBody UserEntity newUser) {
        /*
         * basic checks
         */
        String username = newUser.getUserName();
        String password = newUser.getUserPassword();
        String email = newUser.getUserEmail();

        if (username == null || password == null || email == null) {
            throw new BadRequestException("username/password/email should not be empty");
        }

        if (userRepository.findByUserName(username).size() > 0 ||
                userRepository.findByUserEmail(email).size() > 0) {
            throw new BadRequestException("username or email already exist");
        }

        // only normal user register is accepted
        newUser.setUserRole("user");

        userRepository.save(newUser);

        return new ResponseEntity<>(
                RestResponseUtil.successMsg("created"),
                HttpStatus.CREATED
        );

    }


    /*
     * validate user input in sign up page
     */
    @GetMapping(path="/validate")
    public @ResponseBody ResponseEntity<Boolean> validateRegister(@RequestParam(defaultValue = "") String userName,
                                                                  @RequestParam(defaultValue = "") String userEmail){
        Iterable<UserEntity> users;
        if(userName.length() != 0 && userEmail.length() ==0){
            users = userRepository.findByUserName(userName);
            if(! users.iterator().hasNext()) return new ResponseEntity<>(true,HttpStatus.OK);
            return new ResponseEntity<>(false,HttpStatus.OK);
        }
        if(userName.length() == 0 && userEmail.length() != 0 ){
            users = userRepository.findByUserEmail(userEmail);
            if(! users.iterator().hasNext()) return new ResponseEntity<>(true,HttpStatus.OK);
            return new ResponseEntity<>(false,HttpStatus.NO_CONTENT);
        }
        if(userName.length() != 0 && userEmail.length() != 0 ){
            users = userRepository.findByUserName(userName);
            if(! users.iterator().hasNext()){
                users = userRepository.findByUserEmail(userEmail);
                if(! users.iterator().hasNext()){
                    return new ResponseEntity<>(true,HttpStatus.OK);
                }
                return new ResponseEntity<>(false,HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(false,HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(true,HttpStatus.OK);
    }
}
