package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.model.*;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.FormRepository;
import se.sjtu.formfoss.service.FormService;
import se.sjtu.formfoss.util.AuthRequestUtil;
import se.sjtu.formfoss.util.RestResponseUtil;

import java.sql.Time;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by 86506 on 2017/7/4.
 */
@Controller
@RequestMapping(path = "${url.authentication}")
public class UserAnswerController {
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private FormDataRepository formDataRepository;
    @Autowired
    private FormRepository formRepository;
    @Autowired
    private FormService formService;
    /*
     * seems not useful
     */
    @GetMapping("/useranswers")
    public @ResponseBody
    List<UserAnswerEntity> getAllUserAnswers(@RequestAttribute String userRole)  {
        if (!userRole.equals("admin")) {
            throw new PermissionDenyException("not an admin");
        }

        return userAnswerRepository.findAll();
    }


    /*
     * get a answer by answer id
     */
    @GetMapping("/useranswers/answer/{answerId}")
    public @ResponseBody UserAnswerEntity getUserAnswer(@PathVariable Integer answerId,
                                                        @RequestAttribute Integer userId,
                                                        @RequestAttribute String userRole) {
        UserAnswerEntity answer = userAnswerRepository.findOne(answerId);
        if (answer == null) {
            throw new ObjectNotFoundException("requested answer data not found");
        }

        Integer formId = answer.getFormId();
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            throw new ObjectNotFoundException("related form not found, seemed an inner server error");
        }

        if (!AuthRequestUtil.checkUserAnswerOwnership(answer, form, userId, userRole)) {
            throw new PermissionDenyException("Do not have privilege to access the answer");
        }

        return answer;
    }


    /**
     * get the answers of a form owned by a user
     *
     * @param uId the user id in the request url
     * @param fId the form id in the request url.
     * @param userId the user id in Request Attribute settled by spring filter
     * @param userRole the user role in Request Attribute settled by spring filter
     * @return a list of all answers related
     */
    @GetMapping("/useranswers/{userId}/{formId}")
    public @ResponseBody
    UserAnswerEntity getUserAnswer(@PathVariable Integer uId,
                                   @PathVariable Integer fId,
                                   @RequestAttribute Integer userId,
                                   @RequestAttribute String userRole) {

        if (!(userRole.equals("admin") || uId.equals(userId))) {
            throw new PermissionDenyException("not the owner of the answer");
        }

        List<UserAnswerEntity> answers = userAnswerRepository.findByFormIdAndUserId(fId, uId);
        if (answers.size() > 1) {
            throw new InnerServerErrorException("multi answer found");
        } else if (answers.size() == 1) {
            return answers.get(0);
        } else {
            throw new ObjectNotFoundException("answer not found");
        }
    }


    /**
     * get all answers related to one form
     * @return a list of all answers related to the form
     */
    @GetMapping("useranswers/{formId}")
    public @ResponseBody
    List<UserAnswerEntity> getAnswerOfOneForm(@PathVariable Integer formId,
                                              @RequestAttribute Integer userId,
                                              @RequestAttribute String userRole){
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            throw new InnerServerErrorException("related form structure not found");
        }

        // check ownership
        if (!AuthRequestUtil.checkFormOwnership(form, userId, userRole)) {
            throw new PermissionDenyException("not the owner of the form");
        }

        return userAnswerRepository.findByFormId(formId);
    }


    /**
     * submit a new answer
     * should work for logged in user
     */
    @PostMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> createUserAnswer(@RequestBody UserAnswerEntity userAnswer,
                                            @RequestAttribute Integer userId,
                                            @RequestAttribute String userRole) {
        if (userAnswer.getAnswerId() == null) {
            /*
             * for new answers, give a new answerId
             */
            IdCount idCount=countRepository.findOne("1");
            Integer answerId = idCount.getFormAnswerIdCount();
            answerId += 1;
            userAnswer.setAnswerId(answerId);
            idCount.setFormAnswerIdCount(answerId);
            countRepository.save(idCount);
        }

        if (!AuthRequestUtil.checkUserAnswerSubmitter(userAnswer, userId)) {
            throw new PermissionDenyException("current user and the user to answer the form not same");
        }

        int fid = userAnswer.getFormId();
        List<UserAnswerEntity> answerCheck = userAnswerRepository.findByFormIdAndUserId(fid,userId);
        if (!answerCheck.isEmpty() && answerCheck.get(0).getCommitflag()) {
            throw new BadRequestException("You've already answered this form");
        }

        userAnswer.setCommitflag(true);

        // userAnswer.setUserId(userId);
        userAnswerRepository.save(userAnswer);
        formService.updateFormData(userAnswer);
        return new ResponseEntity<String>("{\"message\": \"Create new answer successfully\"}",HttpStatus.OK);
    }



    /**
     * all answer data a user has answered
     * @param uId
     * @return
     */
    @GetMapping("/users/{uId}/answeredForms")
    public @ResponseBody
    List<FormEntity> getAnsweredForms(@PathVariable Integer uId,
                                      @RequestAttribute Integer userId,
                                      @RequestAttribute String userRole) {
        if (!(userRole.equals("admin") || uId.equals(userId))) {
            throw new PermissionDenyException();
        }

        List<UserAnswerEntity> userAnswers = userAnswerRepository.findByUserId(uId);
        List<FormEntity> answerForms = new ArrayList<>();
        FormEntity form;
        for (int i = 0 ; i < userAnswers.size(); i++) {
            form = formRepository.findOne(userAnswers.get(i).getFormId());
            answerForms.add(form);
        }

        return answerForms;
    }


    /**
     * deprecated
     *
     * @param userAnswer
     * @return
     */
    @PostMapping("/useranswers/tempsave")
    public @ResponseBody
    ResponseEntity<String> tempsaveUserAnswer(@RequestBody UserAnswerEntity userAnswer,@RequestAttribute Integer userId) throws Exception{
        Integer formid = userAnswer.getFormId();
        FormEntity form = formRepository.findOne(formid);
        if (form == null) {
            throw new ObjectNotFoundException("related form not found, seemed an inner server error");
        }
        Integer answerId = userAnswer.getAnswerId();
        if(answerId != null){
            if (!AuthRequestUtil.checkUserAnswerSubmitter(userAnswer, userId)) {
                throw new PermissionDenyException("not the original submitter");
            }
            userAnswerRepository.save(userAnswer);
            return new ResponseEntity<String>("{\"message\": \"Save answer successfully\"}",HttpStatus.OK);
        }
        IdCount idCount=countRepository.findOne("1");
        answerId = idCount.getFormAnswerIdCount();
        answerId +=1;
        userAnswer.setAnswerId(answerId);
        userAnswer.setCommitflag(false);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswerRepository.save(userAnswer);
        return new ResponseEntity<String>("{\"message\": \"Save answer successfully\"}",HttpStatus.OK);
    }



    /**
     * update a answer
     * this should only work for logged in user
     *
     * @param userAnswer the answer structure
     * @return the success message
     */
    @PutMapping("/useranswers")
    public @ResponseBody
    String updateUserAnswer(@RequestBody UserAnswerEntity userAnswer,
                            @RequestAttribute Integer userId,
                            @RequestAttribute String userRole) {
        if (!AuthRequestUtil.checkUserAnswerSubmitter(userAnswer, userId)) {
            throw new PermissionDenyException("not the original submitter");
        }

        Integer answerId = userAnswer.getAnswerId();
        if (answerId == null) {
            throw new BadRequestException("try to update an answer without answerId");
        }

        UserAnswerEntity answer = userAnswerRepository.findOne(answerId);
        if (answer == null) {
            throw new ObjectNotFoundException("original answer not found");
        }

        if (answer.getCommitflag()) {
            throw new BadRequestException("unable to update, answer already submitted");
        }
        formService.updateFormData(userAnswer);
        userAnswerRepository.save(userAnswer);

        return RestResponseUtil.successMsg("updated");
    }

    @DeleteMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> deleteUserAnswer(@RequestParam Integer form_id, @RequestParam Integer user_id,@RequestAttribute Integer userId,
                                            @RequestAttribute String userRole){

        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status=(userAnswer.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;

        if(userAnswer.iterator().hasNext() != false){
            if (!AuthRequestUtil.checkUserAnswerSubmitter(userAnswer.get(0), userId)) {
                throw new PermissionDenyException("not the original submitter");
            }
            userAnswerRepository.deleteByFormIdAndUserId(form_id,user_id);
            formService.deleteFormData(userAnswer.get(0));
            return  new ResponseEntity<String>("{\"message\": \"Delete successfully\"}",status);
        }
        return new ResponseEntity<String>("{\"message\": \"Nothing to delete\"}",HttpStatus.FORBIDDEN);
    }



}
