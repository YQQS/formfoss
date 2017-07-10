package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.exception.GlobalException;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.model.IdCount;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.repository.CountRepository;

import java.io.IOException;
import java.util.List;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
public class FormController {
    @Autowired
    private FormRepository formRepository;
    @Autowired
    private CountRepository countRepository;

    //OK
    @GetMapping(path = "/forms")
    public @ResponseBody
    ResponseEntity<Iterable<FormEntity>> getAllForm() {

        Iterable<FormEntity> allForm = formRepository.findAll();
        HttpStatus status;
        if (!allForm.iterator().hasNext()) {
            status = HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
        }
        status = HttpStatus.OK;
        return new ResponseEntity<Iterable<FormEntity>>(allForm, status);
    }

    //OK
    @GetMapping(path = "/forms/{formId}")
    public @ResponseBody
    ResponseEntity<FormEntity> searchById(@PathVariable Integer formId) {
        List<FormEntity> result = formRepository.findByFormId(formId);
        HttpStatus status = (result.iterator().hasNext() != false) ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        if (result.iterator().hasNext() == false)
            throw new GlobalException(HttpStatus.NOT_FOUND);
        if (result.size() != 1) {
            throw  new GlobalException(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<FormEntity>(result.get(0), status);
    }

    @PostMapping(path = "/forms")
    public synchronized @ResponseBody
    ResponseEntity<String> formAdd(@RequestBody FormEntity form) throws IOException {
        IdCount idCount = countRepository.findOne("1");
        Integer formId = idCount.getFormIdCount();
        formId = formId + 1;
        idCount.setFormIdCount(formId);
        countRepository.save(idCount);
        form.setFormId(formId);
        formRepository.save(form);
        return new ResponseEntity<String>("{\"message\": \"Create new form successfully\"}", HttpStatus.OK);
    }

    @PutMapping(path = "/forms")
    public @ResponseBody
    ResponseEntity<String> formUpdate(@RequestBody FormEntity form) throws IOException {
        formRepository.save(form);
        return new ResponseEntity<String>("{\n" +
            "    \"message\": \"Update form successfully\"\n" +
            "}", HttpStatus.OK);
    }

    //OK
    @DeleteMapping(path = "/forms/{formId}")
    public @ResponseBody
    ResponseEntity<String> formDel(@PathVariable Integer formId) {
        List<FormEntity> form = formRepository.findByFormId(formId);
        HttpStatus status = (form.iterator().hasNext() != false) ? HttpStatus.NON_AUTHORITATIVE_INFORMATION : HttpStatus.NOT_FOUND;
        formRepository.delete(formId);
        if (form.iterator().hasNext() == false)
            return new ResponseEntity<String>("{\n" +
                "    \"code\": 404,\n" +
                "    \"message\": \"Create new orm successfully\"\n" +
                "}", status);
        return new ResponseEntity<String>("{\n" +
            "    \"message\": \"Delete form successfully\"\n" +
            "}", status);
    }

    //OK
    @GetMapping(path = "/users/{uid}/forms")
    public @ResponseBody
    ResponseEntity<Iterable<FormEntity>> getFormByUserId(@PathVariable Integer uid) {
        Iterable<FormEntity> forms = formRepository.findByUserId(uid);
        HttpStatus status;
        if (!forms.iterator().hasNext()) {
            status = HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
        }
        status = HttpStatus.OK;
        return new ResponseEntity<Iterable<FormEntity>>(forms, status);
    }

    //OK
    @GetMapping(path = "/users/{uid}/forms/{fid}")
    public @ResponseBody
    ResponseEntity<List<FormEntity>> getFormByIdAndUserId(@PathVariable int uid, @PathVariable Integer fid) {
        List<FormEntity> form = formRepository.findByFormIdAndUserId(fid, uid);
        HttpStatus status;
        if (form.iterator().hasNext() == false) {
            status = HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
        }
        status = HttpStatus.OK;
        return new ResponseEntity<List<FormEntity>>(form, status);
    }

    @PostMapping(path = "/users/{userId}/forms")
    public @ResponseBody
    ResponseEntity<String> createForm(@RequestBody FormEntity form) throws IOException {
        IdCount idCount = countRepository.findOne("1");
        Integer formId = idCount.getFormIdCount();
        formId = formId + 1;
        HttpStatus status = HttpStatus.OK;
        idCount.setFormIdCount(formId);
        countRepository.save(idCount);
        form.setFormId(formId);
        formRepository.save(form);
        return new ResponseEntity<String>("{\"message\": \"Create new form successfully\"}", status);
    }

    //OK
    @DeleteMapping(path = "/users/{userId}/forms/{formId}")
    public @ResponseBody
    ResponseEntity<String> deleteForm(@PathVariable Integer userId, @PathVariable Integer formId) {
        List<FormEntity> form = formRepository.findByFormId(formId);
        HttpStatus status = (form.iterator().hasNext() != false) ? HttpStatus.NON_AUTHORITATIVE_INFORMATION : HttpStatus.NOT_FOUND;
        if (form.iterator().hasNext() == false || form.iterator().next().getUserId() != userId) {
            status = HttpStatus.FORBIDDEN;
            return new ResponseEntity<String>("{\n" +
                "    \"code\": 403,\n" +
                "    \"message\": \"Form cannot be deleted\"\n" +
                "}", status);
        }
        formRepository.delete(formId);
        return new ResponseEntity<String>("{\n" +
            "    \"message\": \"Delete successfully\"\n" +
            "}", status);
    }

    @PutMapping(path = "/users/{userId}/forms")
    public @ResponseBody
    ResponseEntity<String> updateForm(@RequestBody FormEntity form) throws IOException {
        formRepository.save(form);
        return new ResponseEntity<String>("{\n" +
            "    \"message\": \"Update form successfully\"\n" +
            "}", HttpStatus.OK);
    }


    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Error> GlobalExceptionHandler(GlobalException e) {
        HttpStatus status = e.getStatus();
        Error error = new Error();
        error.setCode(404);
        error.setMessage("Form not found");
        return new ResponseEntity<Error>(error, status);
    }
}

