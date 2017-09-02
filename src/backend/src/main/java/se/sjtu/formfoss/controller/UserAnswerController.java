package se.sjtu.formfoss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import se.sjtu.formfoss.exception.BasicError;
import se.sjtu.formfoss.exception.GlobalException;
import se.sjtu.formfoss.model.*;
import se.sjtu.formfoss.repository.CountRepository;
import se.sjtu.formfoss.repository.UserAnswerRepository;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.FormRepository;

import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Time;
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

    @GetMapping("/useranswers/answer/{answerid}")
    public @ResponseBody
    ResponseEntity<UserAnswerEntity> getUserAnswer(@PathVariable Integer answerid){

        UserAnswerEntity userAnswer = userAnswerRepository.findOne(answerid);
        HttpStatus status = HttpStatus.OK;
        if(userAnswer == null){
            status=HttpStatus.NOT_FOUND;
            throw new GlobalException(status);
        }
        return new ResponseEntity<UserAnswerEntity>(userAnswer,status);

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
    ResponseEntity<String> createUserAnswer(@RequestBody UserAnswerEntity userAnswer, HttpSession httpSession) throws Exception{
        if(userAnswer.getAnswerId() == null){
            IdCount idCount=countRepository.findOne("1");
            Integer answerId = idCount.getFormAnswerIdCount();
            answerId +=1;
            userAnswer.setAnswerId(answerId);
            idCount.setFormAnswerIdCount(answerId);
            countRepository.save(idCount);
        }
        int fid=userAnswer.getFormId();
        Integer uid = (Integer) httpSession.getAttribute("userId");
        List<UserAnswerEntity> answerCheck=userAnswerRepository.findByFormIdAndUserId(fid,uid);
        if(!answerCheck.isEmpty() && answerCheck.get(0).getCommitflag()){
            return new ResponseEntity<String>("{\"message\": \"You have already answer the form!\"}",HttpStatus.OK);
        }
        userAnswer.setCommitflag(true);

        userAnswer.setUserId(uid);
        userAnswerRepository.save(userAnswer);
        int formId=userAnswer.getFormId();
        List<Map<String,Object>> answers = userAnswer.getAnswers();
        FormDataEntity formData = formDataRepository.findOne(formId);
        formData.setAnswerCount(formData.getAnswerCount()+1);
        List<Map<String,Object>> data = formData.getData();
        for(Map<String,Object> map : answers){
            String ansKey = (String) map.get("key");
            String anstype =(String) map.get("type");
            if(anstype.equals("textbox")){
                String answer = (String) map.get("answer");
                for(Map<String,Object> map1 : data){
                    String dataKey = (String) map1.get("key");
                    if(dataKey.equals(ansKey)){
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
                    String dataKey = (String) map1.get("key");
                    if(dataKey.equals(ansKey)){
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
                    String dataKey = (String) map1.get("key");
                    if(dataKey.equals(ansKey)){
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
                    String dataKey = (String) map1.get("key");
                    if (dataKey.equals(ansKey)) {
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
                    String dataKey = (String) map1.get("key");
                    if(dataKey.equals(ansKey)){
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
                    String dataKey = (String) map1.get("key");
                    if (dataKey.equals(ansKey)) {
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

    @GetMapping("/users/{userid}/answerforms")
    public @ResponseBody
    ResponseEntity<List<FormEntity>> getAnswerforms(@PathVariable Integer userid) throws Exception{
        List<UserAnswerEntity> userAnswers = userAnswerRepository.findByUserId(userid);
        List<FormEntity> answerforms = new ArrayList<FormEntity>();
        FormEntity form;
        for(int i = 0 ; i < userAnswers.size(); i++){
            form = formRepository.findOne(userAnswers.get(i).getFormId());
            answerforms.add(form);
        }
        return new ResponseEntity<List<FormEntity>>(answerforms,HttpStatus.OK);

    }

    @PostMapping("/useranswers/tempsave")
    public @ResponseBody
    ResponseEntity<String> tempsaveUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws Exception{
        IdCount idCount=countRepository.findOne("1");
        Integer answerId = idCount.getFormAnswerIdCount();
        answerId +=1;
        userAnswer.setAnswerId(answerId);
        userAnswer.setCommitflag(false);
        idCount.setFormAnswerIdCount(answerId);
        countRepository.save(idCount);
        userAnswerRepository.save(userAnswer);
        return new ResponseEntity<String>("{\"message\": \"Save answer successfully\"}",HttpStatus.OK);
    }

    @GetMapping("/useranswers/keepanswer/{userid}/{formid}")
    public @ResponseBody
    ResponseEntity<UserAnswerEntity> keepanswer(@PathVariable Integer userid,@PathVariable Integer formid){
        List<UserAnswerEntity> userAnswers = userAnswerRepository.findByFormIdAndUserId(formid,userid);
        HttpStatus status = (userAnswers.iterator().hasNext()!=false)?HttpStatus.OK:HttpStatus.NOT_FOUND;
        if(userAnswers.iterator().hasNext() == false)
            throw new GlobalException(HttpStatus.NOT_FOUND);
        UserAnswerEntity userAnswer = userAnswers.get(0);
        return new ResponseEntity<UserAnswerEntity>(userAnswer,status);
    }

    @PutMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> updateUserAnswer(@RequestBody UserAnswerEntity userAnswer) throws IOException{
        if(userAnswer.getCommitflag() == false){
            userAnswerRepository.save(userAnswer);
            return new ResponseEntity<String>("{\"message\": \"Update answer successfully\"}",HttpStatus.OK);
        }
        return new ResponseEntity<String>("{\"error\": \"Can't update committed answer\"}",HttpStatus.FORBIDDEN);
    }

    @DeleteMapping("/useranswers")
    public @ResponseBody
    ResponseEntity<String> deleteUserAnswer(@RequestParam Integer form_id, @RequestParam Integer user_id){
        List<UserAnswerEntity> userAnswer = userAnswerRepository.findByFormIdAndUserId(form_id,user_id);
        HttpStatus status=(userAnswer.iterator().hasNext()!=false)?HttpStatus.NON_AUTHORITATIVE_INFORMATION:HttpStatus.NOT_FOUND;
        if(userAnswer.iterator().hasNext() != false){
            userAnswerRepository.deleteByFormIdAndUserId(form_id,user_id);
            Integer formId = userAnswer.get(0).getFormId();
            List<Map<String,Object>> answers = userAnswer.get(0).getAnswers();
            FormDataEntity formData = formDataRepository.findOne(formId);
            formData.setAnswerCount(formData.getAnswerCount() - 1);
            List<Map<String,Object>> data = formData.getData();
            for(Map<String,Object> map : answers){
                String ansKey = (String) map.get("key");
                String anstype =(String) map.get("type");
                if(anstype.equals("textbox")){
                    String answer = (String) map.get("answer");
                    for(Map<String,Object> map1 : data){
                        String dataKey = (String) map1.get("key");
                        if(dataKey.equals(ansKey)){
                            List<String> result = (List<String>) map1.get("result");
                            for(int i = 0;i< result.size();i++){
                                if(result.get(i).equals(answer)){
                                    result.remove(i);
                                    break;
                                }
                            }
                            map1.put("result",result);
                            break;
                        }
                    }
                }
                else if(anstype.equals("number")){
                    Integer answer = (Integer) map.get("answer");
                    for(Map<String,Object> map1 : data){
                        String dataKey = (String) map1.get("key");
                        if(dataKey.equals(ansKey)){
                            List<Integer> result = (List<Integer>) map1.get("result");
                            for(int i = 0;i< result.size();i++){
                                if(result.get(i).equals(answer)){
                                    result.remove(i);
                                    break;
                                }
                            }
                            map1.put("result",result);
                            break;
                        }
                    }
                }
                else if(anstype.equals("Time")){
                    Time answer = (Time) map.get("answer");
                    for(Map<String,Object> map1 : data){
                        String dataKey = (String) map1.get("key");
                        if(dataKey.equals(ansKey)){
                            List<Time> result = (List<Time>) map1.get("result");
                            for(int i = 0;i< result.size();i++){
                                if(result.get(i).equals(answer)){
                                    result.remove(i);
                                    break;
                                }
                            }
                            map1.put("result",result);
                            break;
                        }
                    }
                }
                else if(anstype.equals("Date")){
                    Date answer = (Date) map.get("answer");
                    for(Map<String,Object> map1 : data) {
                        String dataKey = (String) map1.get("key");
                        if (dataKey.equals(ansKey)) {
                            List<Date> result = (List<Date>) map1.get("result");
                            for(int i = 0;i< result.size();i++){
                                if(result.get(i).equals(answer)){
                                    result.remove(i);
                                    break;
                                }
                            }
                            map1.put("result", result);
                            break;
                        }
                    }
                }
                else if(anstype.equals("singleChoice")){
                    String answer = (String) map.get("answer");
                    for(Map<String,Object> map1 : data){
                        String dataKey = (String) map1.get("key");
                        if(dataKey.equals(ansKey)){
                            List<Map<String,Object>> result = (List<Map<String,Object>>) map1.get("result");
                            for(Map<String,Object> map2 :result){
                                String choiceName = (String) map2.get("choiceName");
                                Integer choiceCount = (Integer) map2.get("choiceCount");
                                if(choiceName.equals(answer)){
                                    choiceCount -= 1;
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
                        String dataKey = (String) map1.get("key");
                        if (dataKey.equals(ansKey)) {
                            List<Map<String, Object>> result = (List<Map<String, Object>>) map1.get("result");
                            for (Map<String, Object> map2 : result) {
                                String choiceName = (String) map2.get("choiceName");
                                Integer choiceCount = (Integer) map2.get("choiceCount");
                                for(String answer : answerlist){
                                    if (choiceName.equals(answer)) {
                                        choiceCount -= 1;
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
            return  new ResponseEntity<String>("{\"message\": \"Delete successfully\"}",status);
        }
        return new ResponseEntity<String>("{\"message\": \"Nothing to delete\"}",HttpStatus.FORBIDDEN);
    }


}
