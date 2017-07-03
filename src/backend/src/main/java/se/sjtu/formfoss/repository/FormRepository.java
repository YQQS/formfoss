package se.sjtu.formfoss.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import se.sjtu.formfoss.model.FormEntity;

import java.util.List;


/**
 * Created by 86506 on 2017/6/29.
 */
public interface FormRepository extends MongoRepository<FormEntity, String> {
    public List<FormEntity> findByUserId(int userId);
    public List<FormEntity> findByIdAndUserId(String id,int uid);
}
