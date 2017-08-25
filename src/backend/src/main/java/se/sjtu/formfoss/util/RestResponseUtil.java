package se.sjtu.formfoss.util;

public class RestResponseUtil {
    public static String errorMsg(String msg) {
        return "{\"errorMsg\":\"" + msg + "\"}";
    }

    public static String successMsg(String msg) {
        return RestResponseUtil.msgToJsonString("message", msg);
    }

    public static String msgToJsonString(String key, String value) {
        return "{\"" + key + "\":\"" + value + "\"}";
    }
}
