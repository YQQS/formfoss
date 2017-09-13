package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.*;
import se.sjtu.formfoss.model.*;
import se.sjtu.formfoss.repository.*;
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
    private UserRepository userRepository;
    @Autowired
    private FormRepository formRepository;
    @Autowired
    private FormService formService;
    /*
     * seems not useful
     */
    @GetMapping({"/useranswers/all", "useranswers/all/"})
    public @ResponseBody
    List<UserAnswerEntity> getAllUserAnswers(@RequestAttribute String userRole)  {
        if (!userRole.equals("admin")) {
            throw new PermissionDenyException("not an admin");
        }

        return userAnswerRepository.findAll();
    }


    /**
     * get a answer data by answerId or formId
     *
     * @param answerId unique id of answer
     * @param formId unique id of form
     * @param userId current user id
     * @param userRole current user role
     * @return answer structure (UserAnswerEntity)
     */
    @RequestMapping(path = {"/useranswers", "useranswers/"}, method = RequestMethod.GET)
    @ResponseStatus(code = HttpStatus.OK)
    public @ResponseBody UserAnswerEntity getAnswer(@RequestParam(required = false) Integer answerId,
                                                    @RequestParam(required = false) Integer formId,
                                                    @RequestAttribute Integer userId,
                                                    @RequestAttribute String userRole) {
        if (answerId == null && formId == null) {
            throw new BadRequestException("no queryParams, either answerId or formId is required");
        }

        else if (answerId != null && formId == null) {
            UserAnswerEntity answer = userAnswerRepository.findOne(answerId);
            if (answer == null) {
                throw new ObjectNotFoundException("the answer of answerId" + answerId + "not found");
            }

            FormEntity form = formRepository.findOne(answer.getFormId());
            if (form == null) {
                throw new ObjectNotFoundException("the form related of formId = " + answer.getFormId() + " not found");
            }

            // check ownership
            if (!AuthRequestUtil.checkUserAnswerOwnership(answer, form, userId, userRole)) {
                throw new PermissionDenyException("do not have privilege");
            }

            return answer;
        }

        else if (answerId == null) {
            FormEntity form = formRepository.findOne(formId);
            if (form == null) {
                throw new ObjectNotFoundException("form of formId " + formId + "not found");
            }

            List<UserAnswerEntity> answers = userAnswerRepository.findByFormIdAndUserId(formId, userId);
            if (answers.size() == 0) {
                throw new ObjectNotFoundException("you've not answered the form of formId=" + formId);
            } else if (answers.size() > 1) {
                throw new InnerServerErrorException("multi answers found, should be a inner database error");
            }

            return answers.get(0);
        }

        else {
            throw new BadRequestException("answerId and formId both specified, please use only one");
        }
    }




    /**
     * get all answers related to one form
     * @return a list of all answers related to the form
     */
    @GetMapping("forms/{formId}/answers")
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

    @RequestMapping(value = {"/users/{uId}/answers", "/users/{uId}/answers/"}, method = RequestMethod.GET)
    public @ResponseBody List<UserAnswerEntity> getAnswersOfUser(@PathVariable Integer uId,
                                                                 @RequestParam(required = false) Boolean submitted,
                                                                 @RequestAttribute Integer userId,
                                                                 @RequestAttribute String userRole) {
        if (!(userRole.equals("admin") || uId.equals(userId))) {
            throw new PermissionDenyException();
        }

        if (submitted == null) {
            return userAnswerRepository.findByUserId(uId);
        }

        if (submitted) {
            return userAnswerRepository.findByUserIdAndCommitflag(uId, true);
        } else {
            return userAnswerRepository.findByUserIdAndCommitflag(uId, false);
        }
    }


    /**
     * to save/update an answer but not submit (update formData)
     *
     * @param userAnswer
     * @return
     */
    @PostMapping("/useranswers/save")
    public @ResponseBody
    String saveAnswer(@RequestBody UserAnswerEntity userAnswer, @RequestAttribute Integer userId) {
        if (userAnswer.getCommitflag()) {
            throw new BadRequestException("can not submit an answer, post to /useranswers instead");
        }

        Integer formId = userAnswer.getFormId();
        FormEntity form = formRepository.findOne(formId);
        if (form == null) {
            throw new ObjectNotFoundException("related form of formId = " + formId + " not found, check your request");
        }
        Integer answerId = userAnswer.getAnswerId();
        if(answerId != null){
            // update a existed answer
            if (!AuthRequestUtil.checkUserAnswerSubmitter(userAnswer, userId)) {
                throw new PermissionDenyException("not the original submitter");
            }
            userAnswerRepository.save(userAnswer);
            return RestResponseUtil.successMsg("answer saved");
        }
        // create a new answer
        IdCount idCount=countRepository.findOne("1");
        answerId = idCount.getFormAnswerIdCount();
        answerId +=1;
        userAnswer.setAnswerId(answerId);
        userAnswer.setCommitflag(false);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswerRepository.save(userAnswer);
        return RestResponseUtil.successMsg("answer saved");
    }


    /**
     * create a new answer and submit
     * should work for logged in user
     */
    @PostMapping("/useranswers")
    public @ResponseBody
    String createUserAnswer(@RequestBody UserAnswerEntity userAnswer,
                            @RequestAttribute Integer userId,
                            @RequestAttribute String userRole) {
        if (userAnswerRepository.findByFormIdAndUserId(userAnswer.getFormId(), userId).size() > 0) {
            throw new BadRequestException("you have an unsubmmitted answer");
        }
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

        UserEntity user = userRepository.findOne(userId);
        user.setUserCredit(user.getUserCredit() - 1);
        userRepository.save(user);

        userAnswerRepository.save(userAnswer);
        formService.updateFormData(userAnswer);
        return RestResponseUtil.successMsg("answer saved and submitted");
    }



    /**
     * update a answer
     * this should only work for logged in user
     * seems not useful
     * use /useranswers/save instead
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


    @DeleteMapping("/useranswers/{answerId}")
    public @ResponseBody
    String deleteUserAnswer(@PathVariable Integer answerId,
                            @RequestAttribute Integer userId,
                            @RequestAttribute String userRole){

        UserAnswerEntity answer = userAnswerRepository.findOne(answerId);
        if (answer == null) {
            throw new ObjectNotFoundException("answer of answerId = " + answerId + " not found");
        }
        FormEntity form = formRepository.findOne(answer.getFormId());
        //if (form == null) {
        //   throw new InnerServerErrorException("original form not found");
        // }

        if (!AuthRequestUtil.checkUserAnswerOwnership(answer, form, userId, userRole)) {
            throw new PermissionDenyException("not allowed");
        }
        userAnswerRepository.delete(answerId);
        if (answer.getCommitflag()) {
            formService.deleteFormData(answer);
        }

        return RestResponseUtil.successMsg("answer deleted");
    }



}
