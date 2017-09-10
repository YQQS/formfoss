package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.BadRequestException;
import se.sjtu.formfoss.exception.ObjectNotFoundException;
import se.sjtu.formfoss.exception.PermissionDenyException;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.model.IdCount;
import se.sjtu.formfoss.model.UserAnswerEntity;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;
import se.sjtu.formfoss.service.FormService;
import se.sjtu.formfoss.controller.UserAnswerController.*;
import se.sjtu.formfoss.util.AuthRequestUtil;

import java.util.List;

@Controller
@RequestMapping(path = "${url.public}")
public class PublicController {

    @Autowired
    private FormService formService;
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private FormDataRepository formDataRepository;
    @Autowired
    private FormRepository formRepository;
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
            throw new ObjectNotFoundException("form not exist");
        } else if (!form.isIsPublished()) {
            throw new PermissionDenyException("don't have the privilege to access the form");
        }
        return new ResponseEntity<>(form, HttpStatus.OK);
    }

    @PostMapping(path = "/useranswers")
    public @ResponseBody
    ResponseEntity<String> createUserAnswer(@RequestBody UserAnswerEntity userAnswer) {

        IdCount idCount=countRepository.findOne("1");
        Integer answerId = idCount.getFormAnswerIdCount();
        answerId += 1;
        userAnswer.setAnswerId(answerId);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswer.setCommitflag(true);
        userAnswerRepository.save(userAnswer);
        UserAnswerController controller=new UserAnswerController();
        controller.updateFormData(userAnswer);
        return new ResponseEntity<String>("{\"message\": \"Create new answer successfully\"}",HttpStatus.OK);
    }

}
