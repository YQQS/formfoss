package se.sjtu.formfoss.model;

import com.fasterxml.jackson.annotation.*;
import org.springframework.data.annotation.Id;

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
public class FormEntity {
    @Id
    String id;

    String title;
    String desc;
    Map<String,Object> settings;
    List<Map<String,Object>> formItems;
    public FormEntity() {}

    public FormEntity(String id,String title,String desc,Map<String,Object> settings,List<Map<String,Object>> formItems) {
        this.id=id;
        this.title = title;
        this.desc =desc;
        this.settings=settings;
        this.formItems=formItems;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
        this.formItems = formItems;
    }


}

