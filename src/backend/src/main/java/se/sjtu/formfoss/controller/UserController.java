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

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.*;

/**
 * Created by ace on 6/28/17.
 */
@Controller
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping(path="/users")
    public @ResponseBody Iterable<UserEntity> getAllUser(@RequestParam(defaultValue = "") String userName,@RequestParam(defaultValue = "") String userEmail, @RequestParam(defaultValue = "false") Boolean fuzzy,HttpSession httpSession)  {

        Integer userid = (Integer)httpSession.getAttribute("userId");
        UserEntity user = userRepository.findOne(userid);
        if(user.getUserRole().equals("admin")) {
            Iterable<UserEntity> allUser = userRepository.findAll();
            HttpStatus status;
            if (!allUser.iterator().hasNext()) {
                status = HttpStatus.NOT_FOUND;
                throw new GlobalException(status);
            }
            status = HttpStatus.OK;
            if (userName.length() == 0 && userEmail.length() == 0) {
                return allUser;
            } else if (userName.length() > 0 && userEmail.length() == 0) {
                if (fuzzy) {
                    allUser = userRepository.findByUserNameContainingIgnoreCase(userName);
                    return allUser;
                }
                allUser = userRepository.findByUserNameIgnoreCase(userName);
                return allUser;
            } else if (userEmail.length() > 0 && userName.length() == 0) {
                if (fuzzy) {
                    allUser = userRepository.findByUserEmailContainingIgnoreCase(userEmail);
                    return allUser;
                }
                allUser = userRepository.findByUserEmailIgnoreCase(userEmail);
                return allUser;
            }

            if (fuzzy) {
                allUser = userRepository.findByUserNameContainingIgnoreCaseAndUserEmailContainingIgnoreCase(userName, userEmail);
                return allUser;
            }
            allUser = userRepository.findByUserNameIgnoreCaseAndUserEmailIgnoreCase(userName, userEmail);
            return allUser;
        }
        return new ArrayList<UserEntity>();
    }


    @GetMapping(path="/users/validate")
    public @ResponseBody ResponseEntity<Boolean> validateRegister(@RequestParam(defaultValue = "") String userName,@RequestParam(defaultValue = "") String userEmail){
        Iterable<UserEntity> users;
        if(userName.length() != 0 && userEmail.length() ==0){
            users = userRepository.findByUserName(userName);
            if(users.iterator().hasNext() == false) return new ResponseEntity<Boolean>(true,HttpStatus.OK);
            return new ResponseEntity<Boolean>(false,HttpStatus.OK);
        }
        if(userName.length() == 0 && userEmail.length() != 0 ){
            users = userRepository.findByUserEmail(userEmail);
            if(users.iterator().hasNext() == false) return new ResponseEntity<Boolean>(true,HttpStatus.OK);
            return new ResponseEntity<Boolean>(false,HttpStatus.NO_CONTENT);
        }
        if(userName.length() != 0 && userEmail.length() != 0 ){
            users = userRepository.findByUserName(userName);
            if(users.iterator().hasNext() == false){
                users = userRepository.findByUserEmail(userEmail);
                if(users.iterator().hasNext() == false){
                    return new ResponseEntity<Boolean>(true,HttpStatus.OK);
                }
                return new ResponseEntity<Boolean>(false,HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<Boolean>(false,HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<Boolean>(true,HttpStatus.OK);
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

    @RequestMapping(path = "/users/login")
    public @ResponseBody ResponseEntity<String> login(@RequestParam String userName,
                                                      @RequestParam String userPassword, HttpSession httpSession) {
        List<UserEntity> users= userRepository.findByUserNameIgnoreCase(userName);
        HttpStatus status;
        if (users.size() == 1 && users.get(0).getUserPassword().equals(userPassword)) {
            status=HttpStatus.OK;
            httpSession.setAttribute("userId",users.get(0).getUserId());
            return new ResponseEntity<String>("{\"message\": \"Login success\"}",status);
        }
        status=HttpStatus.UNAUTHORIZED;
        return new ResponseEntity<String>("{\"message\": \"username or pass word not match\"}",status);
    }

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Error> UserNotFound(GlobalException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("User not found");
        return new ResponseEntity<Error>(error,e.getStatus());
    }


}
