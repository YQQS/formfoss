package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.ls.LSException;
import se.sjtu.formfoss.exception.Error;
import se.sjtu.formfoss.exception.GlobalException;
import se.sjtu.formfoss.model.IdCount;
import se.sjtu.formfoss.model.UserAnswerEntity;
import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;
import se.sjtu.formfoss.repository.FormDataRepository;

import java.io.IOException;
import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by 86506 on 2017/7/4.
 */
@Controller
public class UserAnswerController {
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    @Autowired
    private CountRepository countRepository;
    @Autowired
    private FormDataRepository formDataRepository;


    @GetMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<Iterable<UserAnswerEntity>> getAllUserAnswers()  {

        Iterable<UserAnswerEntity> allUserAnswers =  userAnswerRepository.findAll();
        HttpStatus status;
        if(!allUserAnswers.iterator().hasNext()){
            status=HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
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
            throw new GlobalException(status);
        return new ResponseEntity<List<UserAnswerEntity>>(userAnswer,status);

    }

    @GetMapping("useranswers/{form_id}")
    public @ResponseBody
    ResponseEntity<List<UserAnswerEntity>> getAnswerOfOneForm(@PathVariable Integer form_id){
        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormId(form_id);
        HttpStatus status = (userAnswer.iterator().hasNext()!=false)?HttpStatus.OK:HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext() == false)
            throw new GlobalException(HttpStatus.NOT_FOUND);
        return new ResponseEntity<List<UserAnswerEntity>>(userAnswer,status);
    }

    @PostMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> createUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws Exception{
        IdCount idCount=countRepository.findOne("1");
        Integer answerId = idCount.getFormAnswerIdCount();
        answerId +=1;
        userAnswer.setAnswerId(answerId);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswerRepository.save(userAnswer);
        int formId=userAnswer.getFormId();
        List<Map<String,Object>> answers = userAnswer.getAnswers();
        FormDataEntity formData = formDataRepository.findOne(formId);
        formData.setAnswerCount(formData.getAnswerCount()+1);
        List<Map<String,Object>> data = formData.getData();
        for(Map<String,Object> map : answers){
            Integer ansid = (Integer) map.get("id");
            String anstype =(String) map.get("type");
            if(anstype.equals("string")){
                String answer = (String) map.get("answer");
                for(Map<String,Object> map1 : data){
                    Integer dataid = (Integer) map1.get("id");
                    if(dataid.equals(ansid)){
                        List<String> result = (List<String>) map1.get("result");
                        result.add(answer);
                        map1.put("result",result);
                        break;
                    }
                }
            }
            else if(anstype.equals("number")){
                Integer answer = (Integer) map.get("answer");
                for(Map<String,Object> map1 : data){
                    Integer dataid = (Integer) map1.get("id");
                    if(dataid.equals(ansid)){
                        List<Integer> result = (List<Integer>) map1.get("result");
                        result.add(answer);
                        map1.put("result",result);
                        break;
                    }
                }
            }
            else if(anstype.equals("Time")){
                Time answer = (Time) map.get("answer");
                for(Map<String,Object> map1 : data){
                    Integer dataid = (Integer) map1.get("id");
                    if(dataid.equals(ansid)){
                        List<Time> result = (List<Time>) map1.get("result");
                        result.add(answer);
                        map1.put("result",result);
                        break;
                    }
                }
            }
            else if(anstype.equals("Date")){
                Date answer = (Date) map.get("answer");
                for(Map<String,Object> map1 : data) {
                    Integer dataid = (Integer) map1.get("id");
                    if (dataid.equals(ansid)) {
                        List<Date> result = (List<Date>) map1.get("result");
                        result.add(answer);
                        map1.put("result", result);
                        break;
                    }
                }
            }
            else if(anstype.equals("singleChoice")){
                String answer = (String) map.get("answer");
                for(Map<String,Object> map1 : data){
                    Integer dataid = (Integer) map1.get("id");
                    if(dataid.equals(ansid)){
                        List<Map<String,Object>> result = (List<Map<String,Object>>) map1.get("result");
                        for(Map<String,Object> map2 :result){
                            String choiceName = (String) map2.get("choiceName");
                            Integer choiceCount = (Integer) map2.get("choiceCount");
                            if(choiceName.equals(answer)){
                                choiceCount += 1;
                                map2.put("choiceCount",choiceCount);
                                break;
                            }
                        }
                    }
                }
            }
            else if(anstype.equals("multiChoice")) {
                List<String> answerlist = (List<String>) map.get("answer");
                for (Map<String, Object> map1 : data) {
                    Integer dataid = (Integer) map1.get("id");
                    if (dataid.equals(ansid)) {
                        List<Map<String, Object>> result = (List<Map<String, Object>>) map1.get("result");
                        for (Map<String, Object> map2 : result) {
                            String choiceName = (String) map2.get("choiceName");
                            Integer choiceCount = (Integer) map2.get("choiceCount");
                            for(String answer : answerlist){
                                if (choiceName.equals(answer)) {
                                    choiceCount += 1;
                                    map2.put("choiceCount", choiceCount);
                                }
                            }
                        }
                    }
                }
            }
        }
        formData.setData(data);
        formDataRepository.save(formData);
        return new ResponseEntity<String>("{\"message\": \"Create new answer successfully\"}",HttpStatus.OK);
    }

    @PutMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> updateUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws IOException{
        userAnswerRepository.save(userAnswer);
        return new ResponseEntity<String>("{\"message\": \"Update answer successfully\"}",HttpStatus.OK);
    }

    @DeleteMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> deleteUserAnswer(@RequestParam Integer form_id, @RequestParam Integer user_id){
        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status=(userAnswer.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext() != false){
            userAnswerRepository.deleteByFormIdAndUserId(form_id,user_id);
            return  new ResponseEntity<String>("{\"message\": \"Delete successfully\"}",status);
        }
        return new ResponseEntity<String>("{\"message\": \"Nothing to delete\"}",HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<Error> FormNotFound(GlobalException e){
        Error error=new Error();
        error.setCode(404);
        error.setMessage("Answer not found");
        return new ResponseEntity<Error>(error, HttpStatus.NOT_FOUND);
    }

}
