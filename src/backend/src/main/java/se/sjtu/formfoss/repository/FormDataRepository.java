package se.sjtu.formfoss.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import se.sjtu.formfoss.model.FormDataEntity;

import java.util.List;


/**
 * Created by qhz on 2017/7/4.
 */
public interface FormDataRepository extends MongoRepository<FormDataEntity, Integer> {
}
