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
        return ServiceUtil.getCurrentUser() !== null;
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
     * generic method to handle http request error in *.service.ts
     */
    static handleError(error: Response | any): Observable<string>  {
        let errMsg: string;

        if (error instanceof Response) {
            const body = error.json() || {};
            const err = body.errorMsg || body.error || body.message || '';
            errMsg = `${error.status} - ${error.statusText || ''}: ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log(errMsg);
        return Observable.throw(errMsg);
    }
}
