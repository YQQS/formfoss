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
@RequestMapping(path = "/forms")
public class FormController {
    @Autowired
    private FormRepository formRepository;

    @GetMapping(path = "")
    public @ResponseBody Iterable<FormEntity> getAllForm() {
        return formRepository.findAll();
    }



    @GetMapping(path = "/{id}")
    public @ResponseBody FormEntity getFormById(@PathVariable String id) {
        return formRepository.findOne(id);
    }

    @PostMapping(path = "")
    public @ResponseBody String formAdd(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        FormEntity form=objectMapper.readValue(jsonString,FormEntity.class);
        formRepository.save(form);
        return "{\"message\": \"success\"}";
    }

    @PutMapping(path = "")
    public @ResponseBody String formUpdate(@RequestParam String jsonString) throws IOException {
        ObjectMapper objectMapper=new ObjectMapper();
        FormEntity form = objectMapper.readValue(jsonString,FormEntity.class);
        formRepository.save(form);
        return "{\"message\": \"success\"}";
    }

    @DeleteMapping(path = "/{id}")
    public @ResponseBody String formDel(@PathVariable String id) {
        formRepository.delete(id);
        return "{\"message\" :\"success\"}";
    }
}
