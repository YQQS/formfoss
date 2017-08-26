export class User {
    userId?: number;
    userName: string;
    userPassword: string;
    userEmail: string;
    userPhone?: string;
    userRole?: string;

    constructor(username: string, password: string, email: string) {
        this.userName = username;
        this.userPassword = password;
        this.userEmail = email;
    }
}
