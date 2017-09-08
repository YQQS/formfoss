package se.sjtu.formfoss.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;
/**
 * Created by Administrator on 2017/7/4.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "FormDataEntity")
public class FormDataEntity {
    @Id
    int formId;

    int answerCount;

    Integer userId;

    List<Map<String,Object>> data;

    public void setData(List<Map<String, Object>> data) {
        this.data = data;
    }

    public void setFormId(int formId) {
        this.formId = formId;
    }

    public int getFormId() {
        return formId;
    }

    public List<Map<String, Object>> getData() {
        return data;
    }

    public int getAnswerCount() {
        return answerCount;
    }

    public void setAnswerCount(int answerCount) {
        this.answerCount = answerCount;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return super.toString();
    }
}
