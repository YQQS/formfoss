package se.sjtu.formfoss.model;

import com.fasterxml.jackson.annotation.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import java.util.List;
import java.util.Map;

//import javax.persistence.Entity;
//import javax.persistence.Table;

/**
 * Created by 86506 on 2017/6/29.
 */
//@Entity
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Document(collection = "FormEntity")
public class FormEntity {
    @Id
    @GeneratedValue
    private Integer formId;

    private Integer userId;
    private String title;
    private String desc;
    private Map<String,Object> settings;
    private List<Map<String,Object>> formItems;
    private boolean isPublished;

    public FormEntity() {}

    public Integer getFormId() {
        return formId;
    }

    public void setFormId(Integer id) {
        this.formId = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public Map<String,Object> getSettings() {
        return settings;
    }

    public void setSettings(Map<String,Object> settings) {
        this.settings = settings;
    }

    public List<Map<String,Object>> getFormItems() {
        return formItems;
    }

    public void setFormItems(List<Map<String,Object>> formItems) {
        this.formItems= formItems;
    }

    public boolean isIsPublished() {
        return isPublished;
    }

    public void setIsPublished(boolean published) {
        isPublished = published;
    }
}

