package se.sjtu.formfoss.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.model.*;
import se.sjtu.formfoss.repository.UserRepository;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;
import se.sjtu.formfoss.util.AuthRequestUtil;
import se.sjtu.formfoss.util.RestResponseUtil;

import java.io.IOException;
import java.util.*;

/**
 * Created by 86506 on 2017/6/29.
 */
@Controller
@RequestMapping(path = "${url.authentication}")
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

    /*
     * get all forms in database
     * only work for admin
     */
    @GetMapping(path = "/forms")
    public @ResponseBody
    List<FormEntity> getAllForm(@RequestAttribute(name = "userRole") String role) {
        if (!role.equals("admin")) {
            throw new PermissionDenyException("Not an admin");
        }
        return formRepository.findAll();
    }


    /*
     * get a form by formId
     */
    @GetMapping(path = "/forms/{formId}")
    public @ResponseBody
    FormEntity getFormById(@PathVariable Integer formId,
                          @RequestAttribute(name = "userId") Integer userId,
                          @RequestAttribute(name = "userRole") String userRole) {
        FormEntity form = formRepository.findOne(formId);

        if (form == null) {
            throw new ObjectNotFoundException("form not exist");
        }

        if (form.getSettings().get("shareResult").equals(true)) {
            return form;
        }

        // check ownership
        if (! AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            throw new PermissionDenyException();
        }

        return form;
    }

    @PostMapping(path = "/forms")
    public synchronized @ResponseBody
    ResponseEntity<String> formAdd(@RequestBody FormEntity form,
                                   @RequestAttribute Integer userId,
                                   @RequestAttribute String userRole) {
        Integer uId = form.getUserId();
        if (uId == null) {
            throw new BadRequestException("userId not found in form");
        }
        if (!AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            throw new PermissionDenyException();
        }
        UserEntity user = userRepository.findOne(uId);
        Integer userCredit = user.getUserCredit();
        if(userCredit < 3){
            throw new NoEnoughCreditException();
        }
        userCredit -= 3;
        user.setUserCredit(userCredit);

        userRepository.save(user);
        IdCount idCount = countRepository.findOne("1");
        Integer formId = idCount.getFormIdCount();
        formId = formId + 1;
        idCount.setFormIdCount(formId);
        countRepository.save(idCount);
        form.setFormId(formId);
        formRepository.save(form);
        FormDataEntity formData = new FormDataEntity();
        formData.setFormId(formId);
        formData.setAnswerCount(0);
        List<Map<String,Object>> data=new ArrayList<Map<String, Object>>(),questions=form.getFormItems();
        for (int i=0;i<questions.size();i++){
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
                    if(options.get(j).get("key").equals("other"))
                        choiceData.put("other",new ArrayList<Object>());
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


    /*
     * update a form
     */
    @PutMapping(path = "/forms")
    public @ResponseBody
    String formUpdate(@RequestBody FormEntity form,
                      @RequestAttribute(name = "userId") Integer userId,
                      @RequestAttribute(name = "userRole") String userRole) {

        // check ownership
        if ( AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            formRepository.save(form);
            return RestResponseUtil.successMsg("updated");
        } else {
            throw new PermissionDenyException();
        }
    }

    //OK
    @DeleteMapping(path = "/forms/{formId}")
    public @ResponseBody
    String formDel(@PathVariable Integer formId,
                   @RequestAttribute(name = "userId") Integer userId,
                   @RequestAttribute(name = "userRole") String userRole) {
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            throw new ObjectNotFoundException("form not exist");
        }

        if (! AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            throw new PermissionDenyException();
        }

        formRepository.delete(formId);
        // delete related data
        formDataRepository.delete(formId);
        userAnswerRepository.deleteAllByFormId(formId);

        return RestResponseUtil.successMsg("deleted");
    }

    /*
     * get all forms created by userId = uid
     * work for admin and user themselves
     */
    @GetMapping(path = "/users/{uid}/forms")
    public @ResponseBody
    Iterable<FormEntity> getFormByUserId(@PathVariable Integer uid,
                                         @RequestAttribute Integer userId,
                                         @RequestAttribute String  userRole) {
        if (!(uid.equals(userId) || userRole.equals("admin"))) {
            throw new PermissionDenyException();
        }

        return formRepository.findByUserId(uid);
    }

    /*
     * Deprecated
     */
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

    /*
     * Deprecated
     */
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

    /*
     * Deprecated
     */
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


    /*
     * Deprecated
     */
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


    @PatchMapping(path="/forms/{formId}")
    public @ResponseBody
    String publish(@PathVariable int formId,
                   @RequestAttribute Integer userId,
                   @RequestAttribute String userRole) {
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            throw new ObjectNotFoundException("form not found");
        }
        if (!AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            throw new PermissionDenyException("Not the owner");
        }

        if (form.isIsPublished()) {
            throw new BadRequestException("form already published");
        }
        form.setIsPublished(true);
        formRepository.save(form);

        return RestResponseUtil.successMsg("published");
    }

}

