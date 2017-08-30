package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.exception.GlobalException;

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
                                                         @RequestParam(defaultValue = "false") Boolean fuzzy) {

            if (userName.length() == 0 && userEmail.length() == 0) {
                return userRepository.findAll();
            } else if (userName.length() > 0 && userEmail.length() == 0) {
                if (fuzzy) {
                    return userRepository.findByUserNameContainingIgnoreCase(userName);
                }
                return userRepository.findByUserNameIgnoreCase(userName);
            } else if (userEmail.length() > 0 && userName.length() == 0) {
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



    //search by id
    @GetMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<UserEntity> searchById(@PathVariable Integer id) {
        UserEntity result=userRepository.findOne(id);
        HttpStatus status=result!=null?HttpStatus.OK: HttpStatus.NOT_FOUND;
        if(result==null)
            throw new GlobalException(status);
        return new ResponseEntity<UserEntity>(result,status);
    }

    //delete by id
    @DeleteMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<String> userDel(@PathVariable Integer id) {
        UserEntity result=userRepository.findOne(id);
        HttpStatus status=result!=null?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        userRepository.delete(id);
        if(result==null)
            return new ResponseEntity<String>("{\"code\": 404,\"message\": \"Delete successfully\"}",status);
        return new ResponseEntity<String>("{\"message\": \"Delete successfully\"}",status);
    }


    //create a user
    @PostMapping(path="/users")
    public @ResponseBody ResponseEntity<String> userAdd(@RequestBody UserEntity user) throws IOException {
        userRepository.save(user);
        HttpStatus status=HttpStatus.OK;
        return new ResponseEntity<String>("{\"message\": \"Add new user successfully\"}",status);
    }

    //update a user
    @PutMapping(path = "/users")
    public @ResponseBody ResponseEntity<String> userUpdate(@RequestBody UserEntity user) throws IOException {
        userRepository.save(user);
        return new ResponseEntity<String>("{\"message\": \"Update user successfully\"}",HttpStatus.OK);
    }


    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Error> UserNotFound(GlobalException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("User not found");
        return new ResponseEntity<Error>(error,e.getStatus());
    }


}
