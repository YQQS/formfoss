package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.RoleRepository;
import se.sjtu.formfoss.repository.UserRepository;

/**
 * Created by ace on 6/28/17.
 */
@Controller
@RequestMapping(path = "/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @PostMapping(path = "/all")
    public @ResponseBody Iterable<UserEntity> getAllUser() {
        return userRepository.findAll();
    }

    @PostMapping(path = "/add")
    public @ResponseBody String userAdd(@RequestParam String userName,
                                        @RequestParam String userPassword,
                                        @RequestParam String userEmail,
                                        @RequestParam(required = false) String userPhone) {
        UserEntity newUser = new UserEntity();
        newUser.setUserName(userName);
        newUser.setUserPassword(userPassword);
        newUser.setUserEmail(userEmail);
        if (userPhone != null) {
            newUser.setUserPhone(userPhone);
        }

        userRepository.save(newUser);
        return "{\"message\": \"success\"}";
    }

    @PostMapping(path = "/update")
    public @ResponseBody String userUpdate(@RequestParam Integer userId,
                                           @RequestParam(required = false) String userName,
                                           @RequestParam(required = false) String userPassword,
                                           @RequestParam(required = false) String userEmail,
                                           @RequestParam(required = false) String userPhone) {
        UserEntity user = userRepository.findOne(userId);
        if (user == null) {
            return "{\"errorMsg\": \"User Not Found\"}";
        }

        if (userName != null) {
            user.setUserName(userName);
        }
        if (userPassword != null) {
            user.setUserPassword(userPassword);
        }
        if (userEmail != null) {
            user.setUserEmail(userEmail);
        }
        if (userPhone != null) {
            user.setUserPhone(userPhone);
        }

        userRepository.save(user);
        return "{\"message\" :\"success\"}";
    }

    @PostMapping(path = "/del")
    public @ResponseBody String userDel(@RequestParam Integer userId) {
        userRepository.delete(userId);
        return "{\"message\" :\"success\"}";
    }

    @PostMapping(path = "/search")
    public @ResponseBody Iterable<UserEntity> search(@RequestParam String username) {
        return userRepository.findByUserNameContainingIgnoreCase(username);
    }
}
