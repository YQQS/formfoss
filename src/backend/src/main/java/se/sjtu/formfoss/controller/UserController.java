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
import java.sql.Timestamp;
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
    public @ResponseBody ResponseEntity<Iterable<UserEntity>> getAllUser(@RequestParam(defaultValue = "") String userName,@RequestParam(defaultValue = "") String userEmail, @RequestParam(defaultValue = "false") Boolean fuzzy)  {

        Iterable<UserEntity> allUser =  userRepository.findAll();
        HttpStatus status;
        if(!allUser.iterator().hasNext()){
            //status=HttpStatus.NOT_FOUND;
            throw new NoUserException();
        }
        status=HttpStatus.OK;
        if(userName.length()==0 && userEmail.length()==0){
            return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
        }
        else if(userName.length()>0 && userEmail.length()==0){
            if(fuzzy){
                allUser= userRepository.findByUserNameContainingIgnoreCase(userName);
                return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
            }
            allUser =userRepository.findByUserNameIgnoreCase(userName);
            return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
        }
        else if(userEmail.length()>0 &&userName.length()==0){
            if(fuzzy){
                allUser=userRepository.findByUserEmailContainingIgnoreCase(userEmail);
                return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
            }
            allUser=userRepository.findByUserEmailIgnoreCase(userEmail);
            return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
        }

        if(fuzzy){
            allUser=userRepository.findByUserNameContainingIgnoreCaseAndUserEmailContainingIgnoreCase(userName,userEmail);
            return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
        }
        allUser =userRepository.findByUserNameIgnoreCaseAndUserEmailIgnoreCase(userName, userEmail);
        return new ResponseEntity<Iterable<UserEntity>>(allUser,status);
    }


    //search by id
    @GetMapping(path="/users/{id}")
    public @ResponseBody ResponseEntity<UserEntity> searchById(@PathVariable Integer id) {
        UserEntity result=userRepository.findOne(id);
        HttpStatus status=result!=null?HttpStatus.OK: HttpStatus.NOT_FOUND;
        if(result==null)
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
    public @ResponseBody ResponseEntity<String> userAdd(@RequestBody UserEntity user) throws IOException {
        Integer id=user.getUserId();
        UserEntity res=userRepository.findOne(id);
        HttpStatus status=res==null?HttpStatus.CONFLICT:HttpStatus.OK;
        if(res!=null)
            throw new UserAlreadyExistsException(id);
        Timestamp create_time = new Timestamp(System.currentTimeMillis());
        user.setUserCreateTime(create_time);
        userRepository.save(user);
        return new ResponseEntity<String>("Add new user successfully",status);
    }

    //update a user
    @PutMapping(path = "/users")
    public @ResponseBody ResponseEntity<String> userUpdate(@RequestBody UserEntity user) throws IOException {
        userRepository.save(user);
        return new ResponseEntity<String>("Update user successfully",HttpStatus.OK);
    }

    @RequestMapping(path = "/users/login")
    public @ResponseBody ResponseEntity<String> login(@RequestParam String userName,
                                                      @RequestParam String userPassword) {
        List<UserEntity> users= userRepository.findByUserNameIgnoreCase(userName);
        HttpStatus status;
        if (users.size() == 1 && users.get(0).getUserPassword().equals(userPassword)) {
            status=HttpStatus.OK;
            return new ResponseEntity<String>("Login Success",status);
        }
        status=HttpStatus.FORBIDDEN;
        return new ResponseEntity<String>("username or password not match",status);
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
