import { RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import {AuthenticatedUser} from '../models/authenticatedUser';

export class ServiceUtil {
    static publicUrl = '/public';
    static authUrl = '/auth';
    static jsonHeader = new Headers({'Content-Type': 'application/json'});
    static formHeader = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    static buildAuthReqOpts(): RequestOptions {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

        let header: Headers = new Headers();

        if (currentUser && currentUser.token) {
            header = new Headers({
                'Authorization': 'formfoss ' + currentUser.token,
                'Content-Type': 'application/json'
            });

            return new RequestOptions({
                headers: header
            });
        } else {
            return null;
        }

    }

    /*
     * check authorization info stored in sessionStore
     * restrict anonymous request
     */
    static isLoggedIn(): boolean {
        const user = ServiceUtil.getCurrentUser();
        return user !== null && user.userId !== null
            && user.username !== null && user.token !== null;
    }

    static isAdmin(): boolean {
        const currentUser = ServiceUtil.getCurrentUser();
        return currentUser !== null && currentUser.role === 'admin';
    }

    /*
     * parse the currentUser Object returned from server
     */
    static parseCurrentUser(input: any): AuthenticatedUser {
        return new AuthenticatedUser(input);
    }

    /*
     * get currentUser: AuthenticatedUser from sessionStorage if exist
     */
    static getCurrentUser(): AuthenticatedUser {
        const user = sessionStorage.getItem('currentUser');
        let parsedUser;

        if (user === null) {
            return null;
        } else {
            parsedUser = JSON.parse(user);
            if (parsedUser && parsedUser.token) {
                return new AuthenticatedUser(parsedUser);
            }

            return null;
        }
    }

    /*
     * generic method to handle a successful http response in *.service.ts
     */
    static handleSuccess(res: Response): string {
        let msg: string;
        const body = res.json();
        if (body.message) {
            msg = 'OK, ' + body.message;
        } else {
            msg = 'OK, ' + JSON.stringify(body);
        }

        return msg;
    }

    /*
     * generic method to handle http response error in *.service.ts
     */
    static handleError(error: Response | any): Observable<string>  {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || {};
            const err = body.errorMsg || body.error || body.message || '';
            errMsg = `${error.status} - ${error.statusText || ''} - ${err}`;
        } else {
            errMsg = error.errorMsg ? error.errorMsg : JSON.stringify(error);
        }
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}
