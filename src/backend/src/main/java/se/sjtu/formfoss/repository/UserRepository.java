package se.sjtu.formfoss.repository;

import org.springframework.data.repository.CrudRepository;
import se.sjtu.formfoss.model.UserEntity;

import java.util.List;
/**
 * Created by ace on 6/28/17.
 */
public interface UserRepository extends CrudRepository<UserEntity, Integer> {
    List<UserEntity> findByUserName(String userName);
    List<UserEntity> findByUserNameContainingIgnoreCase(String userName);
    List<UserEntity> findByUserEmailContainingIgnoreCase(String userEmail);
    List<UserEntity> findByUserPhoneContainingIgnoreCase(String userPhone);
}
