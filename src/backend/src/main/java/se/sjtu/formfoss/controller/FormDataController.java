package se.sjtu.formfoss.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.DataNotFoundException;
import se.sjtu.formfoss.exception.NoDataException;
import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.exception.Error;
import java.io.IOException;
import java.util.List;

/**
 * Created by QHZ on 2017/7/4.
 */
@Controller
public class FormDataController {
    @Autowired
    FormDataRepository formDataRepository;

    //Get all form data
    @GetMapping(path="/formdata")
    public @ResponseBody
    ResponseEntity<Iterable<FormDataEntity>> getAllFormData(){
        Iterable<FormDataEntity> result=formDataRepository.findAll();
        HttpStatus status;
        if(!result.iterator().hasNext()){
            throw new NoDataException();
        }
        status=HttpStatus.OK;
        return new ResponseEntity<Iterable<FormDataEntity>>(result,status);
    }

    //Get form data by formId
    @GetMapping(path="/formdata/{fid}")
    public @ResponseBody
    ResponseEntity<FormDataEntity> getFormDataById(@PathVariable int fid){
        FormDataEntity result=formDataRepository.findOne(fid);
        if(result==null){
            throw new DataNotFoundException();
        }
        return new ResponseEntity<FormDataEntity>(result,HttpStatus.OK);
    }

    //Delete form data by formId
    @DeleteMapping(path="/formdata/{fid}")
    public @ResponseBody ResponseEntity<String> delFormDataById(@PathVariable int fid){
        formDataRepository.delete(fid);
        return new ResponseEntity<String>("Delete form data successfully",HttpStatus.OK);
    }

    //Create form data
    @PostMapping(path="/formdata")
    public @ResponseBody ResponseEntity<String> createFormData(@RequestBody FormDataEntity formData) throws IOException {
        int fid=formData.getFormId();
        FormDataEntity result=formDataRepository.findOne(fid);
        HttpStatus status;
        if(result!=null){
            status=HttpStatus.CONFLICT;
            return new ResponseEntity<String>("Form data already exists!",status);
        }
        status=HttpStatus.OK;
        formDataRepository.save(formData);
        return new ResponseEntity<String>("Create form data successfully!",status);

    }

    //Update from data
    @PutMapping(path="/formdata")
    public @ResponseBody ResponseEntity<String> updateFormData(@RequestBody FormDataEntity formData){
        formDataRepository.save(formData);
        return new ResponseEntity<String>("Update form data successfully!",HttpStatus.OK);
    }

    @ExceptionHandler(NoDataException.class)
    public ResponseEntity<Error> NoData(NoDataException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("No form data available");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DataNotFoundException.class)
    public ResponseEntity<Error> DataNotFound(DataNotFoundException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("Data not found");
        return new ResponseEntity<Error>(error,HttpStatus.NOT_FOUND);
    }
}
