package se.sjtu.formfoss.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormRepository;

import java.io.IOException;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
public class FormController {
    @Autowired
    private FormRepository formRepository;

    @GetMapping(path = "/forms")
    public @ResponseBody Iterable<FormEntity> getAllForm() {
        return formRepository.findAll();
    }



    @GetMapping(path = "/forms/{id}")
    public @ResponseBody
    FormEntity getFormById(@PathVariable String id) {
        return formRepository.findOne(id);
    }

    @GetMapping(path = "/users/{uid}/forms")
    public @ResponseBody
    Iterable<FormEntity> getFormByUserId(@PathVariable int uid){
        return formRepository.findByUserId(uid);
    }

    @GetMapping(path="/users/{uid}/forms/{fid}")
    public @ResponseBody
    Iterable<FormEntity> getFormByIdAndUserId(@PathVariable int uid,@PathVariable String fid){
        return formRepository.findByIdAndUserId(fid,uid);
    }

    @PostMapping(path = "/users/{userId}/forms")

    public @ResponseBody

    String createForm(@RequestParam String jsonString) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        FormEntity form = objectMapper.readValue(jsonString,FormEntity.class);

        formRepository.save(form);

        return "{\"message\" :\"success\"}";

    }



    @DeleteMapping(path = "/users/{userId}/forms/{id}")

    public @ResponseBody

    String deleteForm(@PathVariable Integer userId,@PathVariable String id){

        FormEntity form = getFormById(id);

        if (form.getUserId() != userId){

            return "{\"error\" :\"Denied\"}";

        }

        formRepository.delete(id);

        return "{\"message\" :\"success\"}";

    }



    @PutMapping(path = "users/{userId}/forms/{id}")

    public @ResponseBody

    String updateForm(@RequestParam String jsonString) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();

        FormEntity form = objectMapper.readValue(jsonString, FormEntity.class);

        formRepository.save(form);

        return "{\"message\": \"success\"}";

    }


    @PostMapping(path = "/forms")
    public @ResponseBody String formAdd(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        FormEntity form=objectMapper.readValue(jsonString,FormEntity.class);
        formRepository.save(form);
        return "{\"message\": \"success\"}";
    }

    @PutMapping(path = "/forms")
    public @ResponseBody String formUpdate(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        FormEntity form = objectMapper.readValue(jsonString,FormEntity.class);
        formRepository.save(form);
        return "{\"message\": \"success\"}";
    }

    @DeleteMapping(path = "/forms/{id}")
    public @ResponseBody String formDel(@PathVariable String id) {
        formRepository.delete(id);
        return "{\"message\" :\"success\"}";
    }
}
