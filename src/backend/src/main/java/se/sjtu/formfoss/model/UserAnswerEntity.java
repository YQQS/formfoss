package se.sjtu.formfoss.model;

import com.fasterxml.jackson.annotation.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;

/**
 * Created by 86506 on 2017/7/4.
 */

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "userAnswerEntity")
public class UserAnswerEntity {
    @Id
    private Integer answerId;

    // related form id
    private Integer formId;
    // the answerer's user id
    private Integer userId;

    // the answer structure
    List<Map<String,Object>> answers;
    // flag if the answer is submitted
    private  Boolean commitflag;

    public UserAnswerEntity(){};

    public UserAnswerEntity(Integer answer_id,Integer form_id,Integer user_id,List<Map<String,Object>> answers){
        this.answerId = answer_id;
        this.formId = form_id;
        this.userId = user_id;
        this.answers = answers;
        this.commitflag=false;
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

    public void setFormId(Integer id) {
        this.formId = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer user_id) {
        this.userId = user_id;
    }

    public List<Map<String, Object>> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Map<String, Object>> answers) {
        this.answers = answers;
    }

    public void setCommitflag(Boolean commitflag) {
        this.commitflag = commitflag;
    }

    public Boolean getCommitflag() {
        return commitflag;
    }
}
