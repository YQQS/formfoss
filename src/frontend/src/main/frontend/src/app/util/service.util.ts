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
    static checkAuthorization(): boolean {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        return (currentUser && currentUser.token);
    }

    /*
     * parse the currentUser Object returned from server
     */
    static parseCurrentUser(input: any): AuthenticatedUser {
        const authenticatedUser = new AuthenticatedUser();
        authenticatedUser.username = input['username'] || null;
        authenticatedUser.role = input['role'] || null;
        authenticatedUser.token = input['token'] || null;
        return authenticatedUser;
    }

    /*
     * get currentUser: AuthenticatedUser from sessionStorage if exist
     */
    static getCurrentUser(): AuthenticatedUser {
        const user = sessionStorage.getItem('currentUser');
        return user === null ? null : new AuthenticatedUser(JSON.parse(user));
    }

    /*
     * generic method to handle http request error in *.service.ts
     */
    static handleError(error: Response | any): Observable<any>  {
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
