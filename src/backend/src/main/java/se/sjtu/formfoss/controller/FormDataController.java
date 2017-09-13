package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.ObjectNotFoundException;
import se.sjtu.formfoss.exception.PermissionDenyException;
import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.util.AuthRequestUtil;
import se.sjtu.formfoss.util.RestResponseUtil;

import java.io.IOException;

/**
 * Created by QHZ on 2017/7/4.
 */
@Controller
@RequestMapping(path = "${url.authentication}")
public class FormDataController {
    @Autowired
    private FormDataRepository formDataRepository;

    @Autowired
    private FormRepository formRepository;

    //Get all form data
    @GetMapping(path="/formdata")
    public @ResponseBody Iterable<FormDataEntity> getAllFormData(@RequestAttribute String userRole){
        if (!userRole.equals("admin")) {
            throw new PermissionDenyException("Not a Admin");
        }
        return formDataRepository.findAll();
    }

    //Get form data by formId
    @GetMapping(path="/formdata/{fid}")
    @ResponseStatus(code = HttpStatus.OK)
    public @ResponseBody FormDataEntity getFormDataById(@PathVariable int fid,
                                                        @RequestAttribute Integer userId,
                                                        @RequestAttribute String userRole){
        FormDataEntity formData = formDataRepository.findOne(fid);
        if(formData==null){
            throw new ObjectNotFoundException("form data not found");
        }

        FormEntity form = formRepository.findOne(fid);
        // check privilege
        if (!AuthRequestUtil.checkFormDataAccess(form, userId, userRole)) {
            throw new PermissionDenyException("can not access");
        }

        return formData;
    }



    //Delete form data by formId
    @DeleteMapping(path="/formdata/{fid}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public @ResponseBody String delFormDataById(@PathVariable int fid,
                                                @RequestAttribute Integer userId,
                                                @RequestAttribute String userRole) {
        FormDataEntity data = formDataRepository.findOne(fid);
        if (!AuthRequestUtil.checkFormDataOwnership(data, userId, userRole)) {
            throw new PermissionDenyException("No privilege to access the data");
        }
        formDataRepository.delete(fid);
        return RestResponseUtil.successMsg("deleted");
    }

    // Create form data
    // deprecated
    @PostMapping(path="/formdata")
    public @ResponseBody ResponseEntity<String> createFormData(@RequestBody FormDataEntity formData) throws IOException {
        int fid=formData.getFormId();
        FormDataEntity result=formDataRepository.findOne(fid);
        HttpStatus status;
        if(result!=null){
            status=HttpStatus.CONFLICT;
            return new ResponseEntity<String>("{\"code\": 409,\"message\": \"Form data already exists\"}",status);
        }
        status=HttpStatus.OK;
        formDataRepository.save(formData);
        return new ResponseEntity<String>("{\"message\": \"Create form data successfully\"}",status);

    }


    //Update from data
    // deprecated
    @PutMapping(path="/formdata")
    public @ResponseBody ResponseEntity<String> updateFormData(@RequestBody FormDataEntity formData){
        formDataRepository.save(formData);
        return new ResponseEntity<String>("{\"message\": \"Update form data successfully\"}",HttpStatus.OK);
    }

}
