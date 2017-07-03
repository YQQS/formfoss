package se.sjtu.formfoss.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.util.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.model.UserEntity;
import se.sjtu.formfoss.repository.RoleRepository;
import se.sjtu.formfoss.repository.UserRepository;

import java.io.IOException;
import java.util.List;
import java.sql.Timestamp;
/**
 * Created by ace on 6/28/17.
 */
@Controller
@RequestMapping(path = "/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping(path={"/",""})
    public @ResponseBody Iterable<UserEntity> getAllUser() {
        return userRepository.findAll();
    }

    //search by id
    @GetMapping(path="/{id}")
    public @ResponseBody UserEntity searchById(@PathVariable Integer id) {
        return userRepository.findOne(id);
    }

    //delete by id
    @DeleteMapping(path="/{id}")
    public @ResponseBody String userDel(@PathVariable Integer id) {
        userRepository.delete(id);
        return "{\"message\" :\"success\"}";
    }

    //create a user
    @PostMapping(path={"/",""})
    public @ResponseBody String userAdd(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        UserEntity user = objectMapper.readValue(jsonString,UserEntity.class);
        userRepository.save(user);
        return "{\"message\": \"success\"}";
    }

    //update a user
    @PutMapping(path = "")
    public @ResponseBody String userUpdate(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        UserEntity user = objectMapper.readValue(jsonString,UserEntity.class);
        userRepository.save(user);
        return "{\"message\": \"success\"}";
    }

    @RequestMapping(path = "/login")
    public @ResponseBody String login(@RequestParam String userName,
                                      @RequestParam String userPassword) {
        List<UserEntity> users= userRepository.findByUserName(userName);
        if (users.size() == 1 && users.get(0).getUserPassword().equals(userPassword)) {
            return "{\"message\" :\"success\"}";
        }
        return "{\"errorMsg\": \"username or password not match\"}";
    }


//    @RequestMapping(path = "/add")
//    public @ResponseBody String userAdd(@RequestParam String userName,
//                                        @RequestParam String userPassword,
//                                        @RequestParam String userEmail,
//                                        @RequestParam(required = false) String userPhone) {
//        UserEntity newUser = new UserEntity();
//        newUser.setUserName(userName);
//        newUser.setUserPassword(userPassword);
//        newUser.setUserEmail(userEmail);
//        if (userPhone != null) {
//            newUser.setUserPhone(userPhone);
//        }
//
//        userRepository.save(newUser);
//        return "{\"message\": \"success\"}";
//    }

//    @RequestMapping(path = "/update")
//    public @ResponseBody String userUpdate(@RequestParam Integer userId,
//                                           @RequestParam(required = false) String userName,
//                                           @RequestParam(required = false) String userPassword,
//                                           @RequestParam(required = false) String userEmail,
//                                           @RequestParam(required = false) String userPhone) {
//        UserEntity user = userRepository.findOne(userId);
//        if (user == null) {
//            return "{\"errorMsg\": \"User Not Found\"}";
//        }
//
//        if (userName != null) {
//            user.setUserName(userName);
//        }
//        if (userPassword != null) {
//            user.setUserPassword(userPassword);
//        }
//        if (userEmail != null) {
//            user.setUserEmail(userEmail);
//        }
//        if (userPhone != null) {
//            user.setUserPhone(userPhone);
//        }
//
//        userRepository.save(user);
//        return "{\"message\" :\"success\"}";
//    }
//
//
//
//    @RequestMapping(path = "/search")
//    public @ResponseBody Iterable<UserEntity> search(@RequestParam String username) {
//        return userRepository.findByUserNameContainingIgnoreCase(username);
//    }
}
