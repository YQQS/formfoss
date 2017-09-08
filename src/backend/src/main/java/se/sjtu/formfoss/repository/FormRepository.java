package se.sjtu.formfoss.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import se.sjtu.formfoss.model.FormEntity;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;


/**
 * Created by 86506 on 2017/6/29.
 */
public interface FormRepository extends MongoRepository<FormEntity, Integer> {
    List<FormEntity> findByUserId(Integer userId);
    List<FormEntity> findByFormIdAndUserId(Integer formId, Integer userId);
    List<FormEntity> findByFormId(Integer id);
    List<FormEntity> findByIsPublishedIsTrue();
    void deleteAllByUserId(Integer userId);
}
