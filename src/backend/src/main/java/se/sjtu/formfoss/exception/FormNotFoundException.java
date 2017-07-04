package se.sjtu.formfoss.exception;

import org.springframework.http.ResponseEntity;

/**
 * Created by Administrator on 2017/7/3.
 */
public class FormNotFoundException extends RuntimeException{
    private Integer formId;
    public FormNotFoundException(Integer id){
        this.formId=id;
    }

    public void setFormId(Integer id) {
        this.formId = id;
    }

    public Integer getFormId() {
        return formId;
    }
}