export class MessageUtil {
    private static buildMessage(key: string, value: string) {
        // return '{' + key + ':' + value + '}' ;
        let message = {};
        message[key] = value;
        return message;
    }

    static successMessage(msg: string) {
        return MessageUtil.buildMessage('message', msg);
    }

    static errorMessage(msg: string) {
        return MessageUtil.buildMessage('errorMsg', msg);
    }
}
