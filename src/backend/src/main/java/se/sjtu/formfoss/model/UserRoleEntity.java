package se.sjtu.formfoss.model;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by ace on 6/29/17.
 */
@Entity
@Table(name = "user_role")
public class UserRoleEntity implements Serializable{
    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    @Id
    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity roleEntity;

    public UserRoleEntity() {
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public RoleEntity getRoleEntity() {
        return roleEntity;
    }

    public void setRoleEntity(RoleEntity roleEntity) {
        this.roleEntity = roleEntity;
    }

    @Override
    public String toString() {
        return "UserRoleEntity{" +
                "userEntity=" + userEntity +
                ", roleEntity=" + roleEntity +
                '}';
    }
}
