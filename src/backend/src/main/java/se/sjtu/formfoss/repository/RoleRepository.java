package se.sjtu.formfoss.repository;

import org.springframework.data.repository.CrudRepository;
import se.sjtu.formfoss.model.RoleEntity;

/**
 * Created by ace on 6/29/17.
 */
public interface RoleRepository extends CrudRepository<RoleEntity, Integer> {
}
