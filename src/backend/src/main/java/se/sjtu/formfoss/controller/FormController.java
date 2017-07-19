package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.exception.GlobalException;
import se.sjtu.formfoss.model.*;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;

import javax.servlet.http.HttpSession;
import javax.xml.ws.Response;
import java.io.IOException;
import java.util.*;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
public class FormController {
    @Autowired
    private FormRepository formRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private FormDataRepository formDataRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private  UserAnswerRepository userAnswerRepository;

    //OK
    @GetMapping(path = "/forms")
    public @ResponseBody
    ResponseEntity<List<FormEntity>> getAllForm() {
        List<FormEntity> allForm = formRepository.findAll();
        return new ResponseEntity<List<FormEntity>>(allForm, HttpStatus.OK);
    }

    //OK
    @GetMapping(path = "/forms/{formId}")
    public @ResponseBody
    ResponseEntity<FormEntity> searchById(@PathVariable Integer formId) {
        FormEntity result = formRepository.findOne(formId);
        HttpStatus status = (result != null) ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        if (result == null)
            throw new GlobalException(HttpStatus.NOT_FOUND);
        return new ResponseEntity<FormEntity>(result, status);
    }

    @PostMapping(path = "/forms")
    public synchronized @ResponseBody
    ResponseEntity<String> formAdd(@RequestBody FormEntity form,HttpSession httpSession) throws IOException {
        IdCount idCount = countRepository.findOne("1");
        Integer formId = idCount.getFormIdCount();
        formId = formId + 1;
        idCount.setFormIdCount(formId);
        countRepository.save(idCount);
        form.setFormId(formId);
        Integer userid = (Integer) httpSession.getAttribute("userId");
        form.setUserId(userid);
        formRepository.save(form);
        FormDataEntity formData=new FormDataEntity();
        formData.setFormId(formId);
        formData.setAnswerCount(0);
        List<Map<String,Object>> data=new ArrayList<Map<String, Object>>(),questions=form.getFormItems();
        for(int i=0;i<questions.size();i++){
            Map<String,Object> datai=new HashMap<String, Object>();
            datai.put("key",questions.get(i).get("key"));
            datai.put("type",questions.get(i).get("controlType"));
            if(questions.get(i).get("controlType").equals("dropdown")){
                List<Map<String,Object>> choice=new ArrayList<Map<String, Object>>();
                List<Map<String,Object>> options=(List<Map<String,Object>>) questions.get(i).get("options");
                for(int j=0;j<options.size();j++){
                    Map<String,Object> choiceData=new HashMap<String, Object>();
                    choiceData.put("choiceName",options.get(j).get("key"));
                    choiceData.put("choiceCount",0);
                    choice.add(choiceData);
                }
                datai.put("result",choice);
            }else{
                List<Object> res=new ArrayList<Object>();
                datai.put("result",res);
            }
            data.add(datai);
        }

        formData.setData(data);
        formDataRepository.save(formData);
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

    @GetMapping(path = "/form/answers/{formid}")
    public @ResponseBody
    ResponseEntity<List<Map<String,Object>>> getFormanswers(@PathVariable Integer formid){
        HttpStatus status = HttpStatus.OK;
        List<Map<String,Object>> result = new ArrayList<Map<String, Object>>();

        List<UserAnswerEntity> answers = userAnswerRepository.findByFormId(formid);
        if(answers.iterator().hasNext() == false){
            status = HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
        }
        for(int i = 0;i < answers.size(); i++){
            Map<String,Object> map = new HashMap<String, Object>();
            Integer userid = answers.get(i).getUserId();
            Integer answerid=answers.get(i).getAnswerId();
            if(userid == null){
                map.put("userid",0);
                map.put("answerid",answers.get(i).getAnswerId());
                result.add(map);
                continue;
            }
            map.put("userid",answers.get(i).getUserId());
            map.put("answerid",answers.get(i).getAnswerId());
            result.add(map);
        }
        return new ResponseEntity<List<Map<String, Object>>>(result,status);
    }


    @PatchMapping(path="/users/{userId}/forms/{formId}")
    public @ResponseBody
    ResponseEntity<String> publish(@PathVariable int userId,@PathVariable int formId){
        List<FormEntity> forms = formRepository.findByFormIdAndUserId(formId, userId);
        FormEntity form=forms.get(0);
        form.setIsPublished(!form.isIsPublished());
        formRepository.save(form);
        if(form.isIsPublished())
            return new ResponseEntity<String>(" {\n" +
                "            \"message\" : \"Publish form successfully\", \n" +
                "            \"url\" : \"http://localhost:8080/#/questions/"+form.getFormId()+"\"\n" +
                "        }",HttpStatus.OK);
        else
            return new ResponseEntity<String>(" {\n" +
                "            \"message\" : \"UnPublish form successfully\" \n" +
                "        }",HttpStatus.OK);

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

