export class AuthenticatedUser {
    username: string;
    role: string;
    token: string;
    userId: number;
    authorities: {authority: string}[];

    constructor(input: {} = {}) {
        this.username = input['username'] || null;
        this.role = input['role'] || null;
        this.token = input['token'] || null;
        this.userId = input['userId'] || null;
        this.authorities = input['authorities'] || [];
    }
}
