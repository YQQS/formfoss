package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.ObjectNotFoundException;
import se.sjtu.formfoss.exception.PermissionDenyException;
import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.exception.GlobalException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by QHZ on 2017/7/4.
 */
@Controller
@RequestMapping(path = "${url.authentication}")
public class FormDataController {
    @Autowired
    FormDataRepository formDataRepository;

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
    public @ResponseBody
    ResponseEntity<FormDataEntity> getFormDataById(@PathVariable int fid,
                                                   @RequestAttribute Integer userId,
                                                   @RequestAttribute String userRole){
        FormDataEntity formData = formDataRepository.findOne(fid);
        if(formData==null){
            throw new ObjectNotFoundException("form data not found");
        }

        FormDataEntity result=new FormDataEntity();
        result.setFormId(formData.getFormId());
        result.setAnswerCount(formData.getAnswerCount());
        result.setData(formData.getData());
        List<Map<String,Object>> data=formData.getData();
        List<Map<String,Object>> subData=new ArrayList<Map<String, Object>>(formData.getData());
        for(int i=0;i<data.size();i++){
            Map<String,Object> answer=data.get(i);
            if(answer.get("type").equals("textbox")){
                List<String> textResult= (List<String>) answer.get("result");
                if(textResult.size()>15){
                    Map<String,Object> subAnswer=new HashMap<String, Object>(answer);
                    answer.put("hasRestAnswer",true);
                    data.set(i,answer);
                    List<String> subTextResult=textResult.subList(0,15);
                    subAnswer.put("result",subTextResult);
                    subData.set(i,subAnswer);
                }
            }
        }
        formData.setData(data);
        formDataRepository.save(formData);
        result.setData(subData);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }



    //Delete form data by formId
    @DeleteMapping(path="/formdata/{fid}")
    public @ResponseBody ResponseEntity<String> delFormDataById(@PathVariable int fid){
        formDataRepository.delete(fid);
        return new ResponseEntity<String>("{\"message\": \"Delete successfully\"}",HttpStatus.OK);
    }

    //Create form data
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
    @PutMapping(path="/formdata")
    public @ResponseBody ResponseEntity<String> updateFormData(@RequestBody FormDataEntity formData){
        formDataRepository.save(formData);
        return new ResponseEntity<String>("{\"message\": \"Update form data successfully\"}",HttpStatus.OK);
    }

}
