package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.service.FormService;

import java.util.List;

@Controller
@RequestMapping(path = "${url.public}")
public class PublicController {

    @Autowired
    private FormService formService;

    @RequestMapping(path = "/forms/published", method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<List<FormEntity>> getPublishedForm() {
        return new ResponseEntity<>(
                formService.getPublished(),
                HttpStatus.OK
        );
    }


    //OK
    @GetMapping(path = "/forms/{formId}")
    public @ResponseBody
    ResponseEntity<FormEntity> searchById(@PathVariable Integer formId ) {
        FormEntity form = formService.getFormById(formId);
        if (form == null) {
            return new ResponseEntity<>(new FormEntity(), HttpStatus.NOT_FOUND);
        } else if (!form.isIsPublished()) {
            return new ResponseEntity<>(new FormEntity(), HttpStatus.FORBIDDEN);
        }
        return new ResponseEntity<>(form, HttpStatus.OK);
    }
}
