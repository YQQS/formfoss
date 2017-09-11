package se.sjtu.formfoss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.model.UserAnswerEntity;
import se.sjtu.formfoss.repository.FormDataRepository;
import se.sjtu.formfoss.repository.FormRepository;
import java.sql.Time;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;
    @Autowired
    private FormDataRepository formDataRepository;

    public List<FormEntity> getPublished() {
        return formRepository.findByIsPublishedIsTrue();
    }

    public FormEntity getFormById(int id) {
        return formRepository.findOne(id);
    }

    public  void updateFormData(UserAnswerEntity userAnswer){
        int formId = userAnswer.getFormId();
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
                                if(!answer.equals("other")) {

                                    choiceCount += 1;
                                    map2.put("choiceCount", choiceCount);
                                    break;
                                }
                                else{
                                    List<String> otherResult=(List<String>) map2.get("other");
                                    choiceCount += 1;
                                    map2.put("choiceCount", choiceCount);
                                    String otherAnswer=(String) map.get("other");
                                    otherResult.add(otherAnswer);
                                    map2.put("other",otherResult);
                                    break;
                                }
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
                                    if(!answer.equals("other")) {
                                        choiceCount += 1;
                                        map2.put("choiceCount", choiceCount);
                                    }
                                    else {
                                        List<String> otherResult=(List<String>) map2.get("other");
                                        choiceCount += 1;
                                        map2.put("choiceCount", choiceCount);
                                        String otherAnswer=(String) map.get("other");
                                        otherResult.add(otherAnswer);
                                        map2.put("other",otherResult);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        formData.setData(data);
        formDataRepository.save(formData);
    }

    public void deleteFormData(UserAnswerEntity userAnswer){
        Integer formId = userAnswer.getFormId();
        List<Map<String,Object>> answers = userAnswer.getAnswers();
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
    }
}
