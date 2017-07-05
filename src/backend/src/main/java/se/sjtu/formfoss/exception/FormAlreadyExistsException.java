package se.sjtu.formfoss.exception;

/**
 * Created by Administrator on 2017/7/3.
 */
public class FormAlreadyExistsException extends RuntimeException{
    private Integer formId;
    public FormAlreadyExistsException(Integer id){
        this.formId=id;
    }

    public void setFormId(Integer id) {
        this.formId = id;
    }

    public Integer getFormId() {
        return formId;
    }
}