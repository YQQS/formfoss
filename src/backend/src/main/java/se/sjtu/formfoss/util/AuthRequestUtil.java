package se.sjtu.formfoss.util;

import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.model.UserEntity;

public class AuthRequestUtil {
    public static boolean checkFormOwnership(FormEntity form, Integer userId, String userRole) {
        return (form.getUserId() != null && form.getUserId().equals(userId))
                || userRole.equals("admin");
    }

    public static boolean checkUserOwnership(UserEntity user, Integer userId, String userRole) {
        return (user.getUserId() != null && user.getUserId().equals(userId))
                || userRole.equals("admin");
    }
}
