package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.BadRequestException;
import se.sjtu.formfoss.exception.PermissionDenyException;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.util.AuthRequestUtil;
import se.sjtu.formfoss.util.RestResponseUtil;

import java.io.IOException;

/**
 * Created by ace on 6/28/17.
 */
@Controller
@RequestMapping(path = "${url.authentication}")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping(path="/users")
    public @ResponseBody Iterable<UserEntity> getAllUser(@RequestParam(defaultValue = "") String userName,
                                                         @RequestParam(defaultValue = "") String userEmail,
                                                         @RequestParam(defaultValue = "false") Boolean fuzzy,
                                                         @RequestAttribute(name = "userRole") String userRole) {

            if (!userRole.equals("admin")) {
                throw new PermissionDenyException();
            }

            if (userName.length() == 0 && userEmail.length() == 0) {
                return userRepository.findAll();
            } else if (userName.length() > 0 && userEmail.length() == 0) {
                if (fuzzy) {
                    return userRepository.findByUserNameContainingIgnoreCase(userName);
                }
                return userRepository.findByUserNameIgnoreCase(userName);
            } else if (userName.length() == 0) {
                if (fuzzy) {
                    return userRepository.findByUserEmailContainingIgnoreCase(userEmail);
                }
                return userRepository.findByUserEmailIgnoreCase(userEmail);
            }

            if (fuzzy) {
                return userRepository.findByUserNameContainingIgnoreCaseAndUserEmailContainingIgnoreCase(userName, userEmail);
            }
            return userRepository.findByUserNameIgnoreCaseAndUserEmailIgnoreCase(userName, userEmail);
    }



    // search by id
    @GetMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<UserEntity> searchById(@PathVariable Integer id,
                                                               @RequestAttribute(name = "userId") Integer userId,
                                                               @RequestAttribute(name = "userRole") String userRole) {
        UserEntity user = userRepository.findOne(id);

        if (user == null) {
            throw new BadRequestException("Bad request, user not exist");
        }

        if (! AuthRequestUtil.checkUserOwnership(user, userId, userRole)) {
            throw new PermissionDenyException();
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    // delete by id
    @DeleteMapping(path="/users/{id}")
    public @ResponseBody String userDel(@PathVariable Integer id,
                                                        @RequestAttribute(name = "userId") Integer userId,
                                                        @RequestAttribute(name = "userRole") String userRole) {
        UserEntity user = userRepository.findOne(id);

        if (user == null) {
            throw new BadRequestException("Bad request, user not exist");
        }

        if (! AuthRequestUtil.checkUserOwnership(user, userId, userRole)) {
            throw new PermissionDenyException();
        }

        userRepository.delete(id);

        return RestResponseUtil.successMsg("deleted");
    }


    /*
     * create a new user
     * only for admin
     */
    @PostMapping(path="/users")
    public @ResponseBody String userAdd(@RequestBody UserEntity user,
                                        @RequestAttribute(name = "userRole") String userRole) throws IOException {
        if (!userRole.equals("admin")) {
            throw new PermissionDenyException();
        }
        userRepository.save(user);

        return RestResponseUtil.successMsg("created");
    }

    /*
     * update a user
     * work for admin and user themselves
     */
    @PutMapping(path = "/users")
    public @ResponseBody String userUpdate(@RequestBody UserEntity user,
                                                           @RequestAttribute Integer userId,
                                                           @RequestAttribute String userRole) {
        if (!AuthRequestUtil.checkUserOwnership(user, userId, userRole)) {
            throw new PermissionDenyException();
        }
        userRepository.save(user);

        return RestResponseUtil.successMsg("saved");
    }




}
