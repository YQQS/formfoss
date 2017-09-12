package se.sjtu.formfoss.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import se.sjtu.formfoss.model.UserAnswerEntity;

import java.util.List;

/**
 * Created by 86506 on 2017/7/4.
 */
public interface UserAnswerRepository extends MongoRepository<UserAnswerEntity,Integer>{
    List<UserAnswerEntity> findByFormIdAndUserId(Integer formId, Integer userId);
    List<UserAnswerEntity> findByFormId(Integer formId);
    List<UserAnswerEntity> findByUserId(Integer id);
    List<UserAnswerEntity> findByUserIdAndCommitflag(Integer userId, boolean isSubmitted);
    void deleteByFormIdAndUserId(Integer formId, Integer userId);
    void deleteAllByFormId(Integer formId);
    void deleteAllByUserId(Integer userId);
}
