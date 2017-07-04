package se.sjtu.formfoss.exception;

/**
 * Created by 86506 on 2017/7/4.
 */
public class UserAnswerAlreadyExistsException extends RuntimeException{
    private Integer answerId;
    private Integer formId;
    private Integer userId;

    public UserAnswerAlreadyExistsException(Integer form_id, Integer user_id){
        this.formId = form_id;
        this.userId = user_id;
    }

    public UserAnswerAlreadyExistsException(Integer answer_id,Integer form_id, Integer user_id){
        this.answerId = answer_id;
        this.formId = form_id;
        this.userId = user_id;
    }

    public void setAnswerId(Integer answerId) {
        this.answerId = answerId;
    }

    public Integer getAnswerId() {
        return answerId;
    }

    public void setUserId(Integer user_id) {
        this.userId = user_id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setFormId(Integer form_id) {
        this.formId = form_id;
    }

    public Integer getFormId() {
        return formId;
    }
}
