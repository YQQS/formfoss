export class AuthenticatedUser {
    username: string;
    role: string;
    token: string;

    constructor(input: {} = {}) {
        this.username = input['username'] || null;
        this.role = input['role'] || null;
        this.token = input['token'] || null;
    }
}
