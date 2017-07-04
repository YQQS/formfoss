package se.sjtu.formfoss.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.org.apache.regexp.internal.RE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.exception.NoUserAnswerException;
import se.sjtu.formfoss.exception.UserAnswerAlreadyExistsException;
import se.sjtu.formfoss.exception.UserAnswerNotFoundException;
import se.sjtu.formfoss.model.IdCount;
import se.sjtu.formfoss.model.UserAnswerEntity;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;

import java.io.IOException;
import java.util.List;

/**
 * Created by 86506 on 2017/7/4.
 */
@Controller
public class UserAnswerController {
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    @Autowired
    private CountRepository countRepository;

    @GetMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<Iterable<UserAnswerEntity>> getAllUserAnswers()  {

        Iterable<UserAnswerEntity> allUserAnswers =  userAnswerRepository.findAll();
        HttpStatus status;
        if(!allUserAnswers.iterator().hasNext()){
            //status=HttpStatus.NOT_FOUND;
            throw new NoUserAnswerException();
        }
        status=HttpStatus.OK;
        return new ResponseEntity<Iterable<UserAnswerEntity>>(allUserAnswers,status);
    }

    @GetMapping("/useranswers/{user_id}/{form_id}")
    public @ResponseBody
    ResponseEntity<List<UserAnswerEntity>> getUserAnswer(@PathVariable Integer user_id,@PathVariable Integer form_id){

        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status = (userAnswer.iterator().hasNext()!=false)?HttpStatus.OK: HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext()==false)
            throw new UserAnswerNotFoundException(form_id,user_id);
        return new ResponseEntity<List<UserAnswerEntity>>(userAnswer,status);

    }

    @GetMapping("useranswers/{form_id}")
    public @ResponseBody
    ResponseEntity<List<UserAnswerEntity>> getAnswerOfOneForm(@PathVariable Integer form_id){
        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormId(form_id);
        HttpStatus status = (userAnswer.iterator().hasNext()!=false)?HttpStatus.OK:HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext() == false)
            throw new UserAnswerNotFoundException(form_id);
        return new ResponseEntity<List<UserAnswerEntity>>(userAnswer,status);
    }

    @PostMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> createUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws IOException{
        IdCount idCount=countRepository.findOne("1");
        Integer answerId = idCount.getFormAnswerIdCount();
        answerId +=1;
        userAnswer.setAnswerId(answerId);
        Integer form_id = userAnswer.getFormId();
        Integer user_id = userAnswer.getUserId();
        List<UserAnswerEntity> res = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status=(res.iterator().hasNext()==false)?HttpStatus.CONFLICT:HttpStatus.OK;
        if(res.iterator().hasNext() != false)
            throw new UserAnswerAlreadyExistsException(form_id,user_id);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswerRepository.save(userAnswer);
        return new ResponseEntity<String>("Create new answer successfully",status);
    }

    @PutMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> updateUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws IOException{
        userAnswerRepository.save(userAnswer);
        return new ResponseEntity<String>("Update answer successfully",HttpStatus.OK);
    }

    @DeleteMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> deleteUserAnswer(@RequestParam Integer form_id, @RequestParam Integer user_id){
        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status=(userAnswer.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext() != false){
            userAnswerRepository.deleteByFormIdAndUserId(form_id,user_id);
            return  new ResponseEntity<String>("Delete successfully",status);
        }
        return new ResponseEntity<String>("Nothing to delete",HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(UserAnswerNotFoundException.class)
    public ResponseEntity<Error> FormNotFound(UserAnswerNotFoundException e){
        //Integer form_id = e.getForm_id();
        Error error=new Error();
        error.setCode(404);
        error.setMessage("Answer not found");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAnswerAlreadyExistsException.class)
    public ResponseEntity<Error> FormAlreadyExists(UserAnswerNotFoundException e){
        //Integer form_id = e.getForm_id();
        Error error=new Error();
        error.setCode(409);
        error.setMessage("Answer Already Exists");
        return new ResponseEntity<Error>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoUserAnswerException.class)
    public ResponseEntity<Error> NoUser(NoUserAnswerException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("No Answers");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }
}
