package se.sjtu.formfoss.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.exception.FormAlreadyExistsException;
import se.sjtu.formfoss.exception.FormNotFoundException;
import se.sjtu.formfoss.exception.NoFormException;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormRepository;

import java.io.IOException;
import java.util.List;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
public class FormController {
    @Autowired
    private FormRepository formRepository;
    //OK
    @GetMapping(path = "/forms")
    public @ResponseBody
    ResponseEntity<Iterable<FormEntity>> getAllForm()  {

        Iterable<FormEntity> allForm =  formRepository.findAll();
        HttpStatus status;
        if(!allForm.iterator().hasNext()){
            //status=HttpStatus.NOT_FOUND;
            throw new NoFormException();
        }
        status=HttpStatus.OK;
        return new ResponseEntity<Iterable<FormEntity>>(allForm,status);
    }

    //OK
    @GetMapping(path = "/forms/{formId}")
    public @ResponseBody ResponseEntity<List<FormEntity>> searchById(@PathVariable Integer formId) {
        List<FormEntity> result=formRepository.findByFormId(formId);
        HttpStatus status=(result.iterator().hasNext()!=false)?HttpStatus.OK: HttpStatus.NOT_FOUND;
        if(result.iterator().hasNext()==false)
            throw new FormNotFoundException(formId);
        return new ResponseEntity<List<FormEntity>>(result,status);
    }

    @PostMapping(path = "/forms")
    public @ResponseBody ResponseEntity<String> formAdd(@RequestBody FormEntity form) throws IOException {
        Integer formId=form.getFormId();
        List<FormEntity> res=formRepository.findByFormId(formId);
        HttpStatus status=(res.iterator().hasNext()==false)?HttpStatus.CONFLICT:HttpStatus.OK;
        if(res.iterator().hasNext()!=false)
            throw new FormAlreadyExistsException(formId);
        formRepository.save(form);
        return new ResponseEntity<String>("Create new form successfully",status);
    }

    @PutMapping(path = "/forms")
    public @ResponseBody ResponseEntity<String> formUpdate(@RequestBody FormEntity form) throws IOException {
        formRepository.save(form);
        return new ResponseEntity<String>("Update form successfully",HttpStatus.OK);
    }

    //OK
    @DeleteMapping(path = "/forms/{formId}")
    public @ResponseBody ResponseEntity<String> formDel(@PathVariable Integer formId) {
        List<FormEntity> form=formRepository.findByFormId(formId);
        HttpStatus status=(form.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        formRepository.delete(formId);
        if(form.iterator().hasNext()==false)
            return new ResponseEntity<String>("Form not found",status);
        return new ResponseEntity<String>("Delete successfully",status);
    }

    //OK
    @GetMapping(path = "/users/{uid}/forms")
    public @ResponseBody ResponseEntity<Iterable<FormEntity>> getFormByUserId(@PathVariable Integer uid) {
        Iterable<FormEntity> forms = formRepository.findByUserId(uid);
        HttpStatus status;
        if(!forms.iterator().hasNext()){
            //status=HttpStatus.NOT_FOUND;
            throw new NoFormException();
        }
        status=HttpStatus.OK;
        return new ResponseEntity<Iterable<FormEntity>>(forms,status);
    }

    //OK
    @GetMapping(path="/users/{uid}/forms/{fid}")
    public @ResponseBody ResponseEntity<List<FormEntity>> getFormByIdAndUserId(@PathVariable int uid,@PathVariable Integer fid) {
        List<FormEntity> form =  formRepository.findByFormIdAndUserId(fid,uid);
        HttpStatus status;
        if(form.iterator().hasNext() == false){
            //status=HttpStatus.NOT_FOUND;
            throw new FormNotFoundException(fid);
        }
        status=HttpStatus.OK;
        return new ResponseEntity<List<FormEntity>>(form,status);
    }

    @PostMapping(path = "/users/{userId}/forms")
    public @ResponseBody
    String createForm(@RequestBody FormEntity form) throws IOException {
        String jsonMessage;
        formRepository.save(form);
        jsonMessage = "{\"message\" :\"success\"}";
        return jsonMessage;
    }

    //OK
    @DeleteMapping(path = "/users/{userId}/forms/{formId}")
    public @ResponseBody ResponseEntity<String> deleteForm(@PathVariable Integer userId,@PathVariable Integer formId){
        List<FormEntity> form = formRepository.findByFormId(formId);
        HttpStatus status=(form.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        if (form.iterator().hasNext() == false ||form.iterator().next().getUserId() != userId){
            status = HttpStatus.FORBIDDEN;
            return new ResponseEntity<String>("Form cannot be deleted",status);
        }
        formRepository.delete(formId);
        return  new ResponseEntity<String>("Delete successfully",status);
    }

    @PutMapping(path = "/users/{userId}/forms")
    public @ResponseBody ResponseEntity<String> updateForm(@RequestBody FormEntity form) throws IOException {
        formRepository.save(form);
        return new ResponseEntity<String>("Update form successfully",HttpStatus.OK);
    }

    @ExceptionHandler(FormNotFoundException.class)
    public ResponseEntity<Error> FormNotFound(FormNotFoundException e){
        Integer id = e.getFormId();
        Error error=new Error();
        error.setCode(404);
        error.setMessage("Form not found");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FormAlreadyExistsException.class)
    public ResponseEntity<Error> FormAlreadyExists(FormNotFoundException e){
        Integer id = e.getFormId();
        Error error=new Error();
        error.setCode(409);
        error.setMessage("Form Already Exists");
        return new ResponseEntity<Error>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoFormException.class)
    public ResponseEntity<Error> NoUser(NoFormException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("No Forms");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }
}