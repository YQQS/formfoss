package se.sjtu.formfoss.util;

import se.sjtu.formfoss.model.FormDataEntity;
import se.sjtu.formfoss.model.FormEntity;
import se.sjtu.formfoss.model.UserAnswerEntity;
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

    public static boolean checkFormDataOwnership(FormDataEntity data, Integer userId, String userRole) {
        return (data.getUserId() != null && data.getUserId().equals(userId)) || userRole.equals("admin");
    }

    public static boolean checkFormDataAccess(FormEntity form, Integer userId, String userRole) {
        return form.getUserId().equals(userId) || userRole.equals("admin") || form.getSettings().get("shareResult").equals(true);
    }

    public static boolean checkUserAnswerOwnership(UserAnswerEntity answer, FormEntity form, Integer userId, String userRole) {
        return userRole.equals("admin") ||
                (form.getUserId() != null && form.getUserId().equals(userId)) ||
                (answer.getUserId() != null && answer.getUserId().equals(userId));
    }

    public static boolean checkUserAnswerSubmitter(UserAnswerEntity answer, Integer userId) {
        return answer.getUserId().equals(userId);
    }
}
