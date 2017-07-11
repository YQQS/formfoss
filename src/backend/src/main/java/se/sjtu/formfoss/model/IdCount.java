package se.sjtu.formfoss.model;
import com.fasterxml.jackson.annotation.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.*;
import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;
import java.util.Map;
/**
 * Created by Administrator on 2017/7/4.
 */
@Document(collection = "IdCount")
public class IdCount {
    @Id
    private String id;
    private int formIdCount;
    private int formAnswerIdCount;

    public IdCount(String id,int formIdCount,int formAnswerIdCount){
        this.id=id;
        this.formIdCount=formIdCount;
        this.formAnswerIdCount=formAnswerIdCount;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getFormAnswerIdCount() {
        return formAnswerIdCount;
    }

    public void setFormAnswerIdCount(int formAnswerIdCount) {
        this.formAnswerIdCount = formAnswerIdCount;
    }

    public int getFormIdCount() {
        return formIdCount;
    }

    public void setFormIdCount(int formIdCount) {
        this.formIdCount = formIdCount;
    }
}
