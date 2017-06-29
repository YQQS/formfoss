package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormRepository;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
@RequestMapping(path = "/form")
public class FormController {
    @Autowired
    private FormRepository formRepository;

    @GetMapping(path = "/all")
    public @ResponseBody Iterable<FormEntity> getAllForm() {
        return formRepository.findAll();
    }

    @GetMapping(path = "/add")
    public @ResponseBody String userAdd(@RequestParam String title) {
        FormEntity newForm = new FormEntity();
        newForm.setTitle(title);
        formRepository.save(newForm);
        return "{\"message\": \"success\"}";
    }

    @GetMapping(path = "/update")
    public @ResponseBody String userUpdate(@RequestParam String formId,
                                           @RequestParam String title) {
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            return "{\"errorMsg\": \"User Not Found\"}";
        }

        form.setTitle(title);

        formRepository.save(form);
        return "{\"message\" :\"success\"}";
    }

    @GetMapping(path = "/del")
    public @ResponseBody String formDel(@RequestParam String formId) {
        formRepository.delete(formId);
        return "{\"message\" :\"success\"}";
    }
}
