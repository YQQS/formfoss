package se.sjtu.formfoss.model;

import org.springframework.data.annotation.Id;

import javax.persistence.*;

//import javax.persistence.Entity;
//import javax.persistence.Table;

/**
 * Created by 86506 on 2017/6/29.
 */
//@Entity
public class FormEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public String id;

    public String title;

    public FormEntity() {}

    public FormEntity(String title) {
        this.title = title;
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

    @Override
    public String toString() {
        return String.format(
            "FormEntity[id=%s, title='%s']",
            id, title);
    }

}

