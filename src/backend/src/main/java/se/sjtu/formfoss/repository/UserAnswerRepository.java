package se.sjtu.formfoss.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import se.sjtu.formfoss.model.UserAnswerEntity;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.List;

/**
 * Created by 86506 on 2017/7/4.
 */
public interface UserAnswerRepository extends MongoRepository<UserAnswerEntity,Integer>{
    List<UserAnswerEntity> findByFormIdAndUserId(Integer formid, Integer userid);
    List<UserAnswerEntity> findByFormId(Integer formid);
    List<UserAnswerEntity> findByUserId(Integer id);
    void deleteByFormIdAndUserId(Integer form_id, Integer user_id);
}
