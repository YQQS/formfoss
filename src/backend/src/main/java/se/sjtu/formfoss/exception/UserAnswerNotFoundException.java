package se.sjtu.formfoss.exception;

import org.omg.SendingContext.RunTime;

import javax.persistence.criteria.CriteriaBuilder;

/**
 * Created by 86506 on 2017/7/4.
 */
public class UserAnswerNotFoundException extends RuntimeException {
    private Integer answerId;
    private Integer formId;
    private Integer userId;

    public UserAnswerNotFoundException(Integer form_id){
        this.formId = form_id;
    }

    public UserAnswerNotFoundException(Integer form_id, Integer user_id){
        this.formId = form_id;
        this.userId = user_id;
    }

    public UserAnswerNotFoundException(Integer answer_id,Integer form_id,Integer user_id){
        this.answerId = answer_id;
        this.formId = form_id;
        this.userId = user_id;
    }

    public Integer getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Integer answerId) {
        this.answerId = answerId;
    }

    public Integer getFormId() {
        return formId;
    }

    public void setFormId(Integer form_id) {
        this.formId = form_id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer user_id) {
        this.userId = user_id;
    }
}
