package se.sjtu.formfoss.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.Map;
/**
 * Created by Administrator on 2017/7/4.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class FormDataEntity {
    @Id
    int formId;
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

    @Override
    public String toString() {
        return super.toString();
    }
}
