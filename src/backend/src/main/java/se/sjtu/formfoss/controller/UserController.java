package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.RoleRepository;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.exception.UserNotFoundException;

import java.io.IOException;
import java.util.List;
/**
 * Created by ace on 6/28/17.
 */
@Controller
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping(path="/users")
    public @ResponseBody Iterable<UserEntity> getAllUser(@RequestParam(defaultValue = "") String userName,
                                                         @RequestParam(defaultValue = "") String userEmail,
                                                         @RequestParam(defaultValue = "false") Boolean fuzzy)  {

        if (userName.length()==0 && userEmail.length()==0){
            return userRepository.findAll();
        }
        else if(userName.length() > 0 && userEmail.length() == 0) {
            if(fuzzy) {
                return userRepository.findByUserNameContainingIgnoreCase(userName);
            }
            return userRepository.findByUserNameIgnoreCase(userName);
        }
        else if(userEmail.length()>0 &&userName.length()==0){
            if(fuzzy){
                return userRepository.findByUserEmailContainingIgnoreCase(userEmail);
            }
            return userRepository.findByUserEmailIgnoreCase(userEmail);
        }

        if(fuzzy){
            return userRepository.findByUserNameContainingIgnoreCaseAndUserEmailContainingIgnoreCase(userName, userEmail);
        }
        return userRepository.findByUserNameIgnoreCaseAndUserEmailIgnoreCase(userName, userEmail);
    }


    //search by id
    @GetMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<UserEntity> searchById(@PathVariable Integer id) {
        UserEntity result = userRepository.findOne(id);
        HttpStatus status = result!=null ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        if(result == null)
            throw new UserNotFoundException(id);
        return new ResponseEntity<UserEntity>(result,status);
    }

    //delete by id
    @DeleteMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<String> userDel(@PathVariable Integer id) {
        UserEntity result=userRepository.findOne(id);
        HttpStatus status=result!=null?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        userRepository.delete(id);
        if(result==null)
            return new ResponseEntity<String>("User not found",status);
        return new ResponseEntity<String>("Delete successfully",status);
    }


    //create a user
    @PostMapping(path="/users")
    public @ResponseBody String userAdd(@RequestBody UserEntity user) {
        /* bugly
        Integer id=user.getUserId();
        UserEntity res=userRepository.findOne(id);
        HttpStatus status=res==null?HttpStatus.CONFLICT:HttpStatus.OK;
        if(res!=null)
            throw new UserAlreadyExistsException(id);
        Timestamp create_time = new Timestamp(System.currentTimeMillis());
        user.setUserCreateTime(create_time);
        userRepository.save(user);
        return new ResponseEntity<String>("Add new user successfully",status);
         */
        userRepository.save(user);
        return "{\"message\": \"Registered\"}";
    }

    //update a user
    @PutMapping(path = "/users")
    public @ResponseBody ResponseEntity<String> userUpdate(@RequestBody UserEntity user) throws IOException {
        userRepository.save(user);
        return new ResponseEntity<String>("{\"message\": \"Updated\"}", HttpStatus.OK);
    }

    @RequestMapping(path = "/users/login", method = RequestMethod.POST)
    public @ResponseBody ResponseEntity<String> login(@RequestParam String userName,
                                                      @RequestParam String userPassword) {
        List<UserEntity> users= userRepository.findByUserNameIgnoreCase(userName);
        HttpStatus status;
        if (users.size() == 1 && users.get(0).getUserPassword().equals(userPassword)) {
            status=HttpStatus.OK;
            String message = "{\"message\": \"Login Success\"}";
            return new ResponseEntity<String>(message, status);
        }
        status=HttpStatus.UNAUTHORIZED;
        String errorMsg = "{\"errorMsg\": \"username or password not match\"}";
        return new ResponseEntity<String>(errorMsg, status);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Error> UserNotFound(UserNotFoundException e){
        int userId = e.getUserId();
        Error error=new Error();
        error.setCode(404);
        error.setMessage("User not found");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Error> UserAlreadyExists(UserNotFoundException e){
        int userId = e.getUserId();
        Error error=new Error();
        error.setCode(409);
        error.setMessage("User Already Exists");
        return new ResponseEntity<Error>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoUserException.class)
    public ResponseEntity<Error> NoUser(NoUserException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("No Users");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

}
