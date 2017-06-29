package se.sjtu.formfoss.model;

import javax.management.relation.RoleNotFoundException;
import javax.persistence.*;
import javax.websocket.ClientEndpoint;
import java.sql.Timestamp;
import java.util.Set;

/**
 * Created by ace on 6/28/17.
 */
@Entity
@Table(name = "User")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "user_id", length = 11)
    private Integer userId;

    @Column(name = "user_name", length = 32, nullable = false)
    private String userName;

    @Column(name = "password", length = 64, nullable = false)
    private String userPassword;

    @Column(name = "email", length = 128, nullable = false)
    private String userEmail;

    @Column(name = "phone",  length = 16)
    private String userPhone;

    @Column(name = "create_time",  updatable = false, nullable = false)
    private Timestamp userCreateTime;

    @OneToMany(mappedBy = "userEntity", cascade = CascadeType.ALL)
    private Set<UserRoleEntity> userRoleEntities;

    public UserEntity() {
    }

    public Timestamp getCreateTime() {
        return userCreateTime;
    }

    public void setCreateTime(Timestamp userCreateTime) {
        this.userCreateTime = userCreateTime;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public Set<UserRoleEntity> getUserRoleEntities() {
        return userRoleEntities;
    }

    public void setUserRoleEntities(Set<UserRoleEntity> userRoleEntities) {
        this.userRoleEntities = userRoleEntities;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", userPassword='" + userPassword + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", userPhone='" + userPhone + '\'' +
                ", userCreateTime=" + userCreateTime +
                '}';
    }
}
