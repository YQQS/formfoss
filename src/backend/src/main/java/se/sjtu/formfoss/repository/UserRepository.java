package se.sjtu.formfoss.repository;

import org.springframework.data.repository.CrudRepository;
import se.sjtu.formfoss.model.UserEntity;

import java.util.List;
/**
 * Created by ace on 6/28/17.
 */
public interface UserRepository extends CrudRepository<UserEntity, Integer> {
    List<UserEntity> findByUserNameIgnoreCase(String userName);
    List<UserEntity> findByUserNameContainingIgnoreCase(String userName);
    List<UserEntity> findByUserEmailIgnoreCase(String userEamil);
    List<UserEntity> findByUserEmailContainingIgnoreCase(String userEmail);
    List<UserEntity> findByUserPhoneContainingIgnoreCase(String userPhone);
    List<UserEntity> findByUserNameIgnoreCaseAndUserEmailIgnoreCase(String userName, String userEmail);
    List<UserEntity> findByUserNameContainingIgnoreCaseAndUserEmailContainingIgnoreCase(String userName, String userEmail);
}
