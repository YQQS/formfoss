package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
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
}
