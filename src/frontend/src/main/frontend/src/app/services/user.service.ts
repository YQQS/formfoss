import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response, RequestOptionsArgs} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay'

import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

import {Observable} from 'rxjs/Observable';
import { User } from '../models/user';
import {MessageUtil} from '../util/message.util';
import {ServiceUtil} from '../util/service.util';

@Injectable()
export class UserService {
    private userUrl = ServiceUtil.authUrl + '/users/';
    private loginUrl = ServiceUtil.publicUrl + '/getCredential';
    private registerUrl = ServiceUtil.publicUrl + '/signup';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});
    private formHeader = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    constructor(private http: Http) { }

    getAll(userName?: string, userEmail?: string, fuzzy: boolean = false): Observable<any> {
        let url: string = this.userUrl + `?fuzzy=${fuzzy}`;
        if (userName) {
            url += `&userName=${userName}`;
        }
        if (userEmail) {
            url += `&userEmail=${userEmail}`;
        }
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map(response => {
                    return response.json() as User[];
                }
            )
            .catch(ServiceUtil.handleError);
    }

    nameConflict(name: string): Observable<boolean> {
        const url = ServiceUtil.publicUrl + `/validate?userName=${name}`;
        return this.http.get(url)
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(res => res.json() as boolean)
    }

    emailConflict(email: string): Observable<boolean> {
        const url = ServiceUtil.publicUrl + `/validate?userEmail=${email}`;
        return this.http.get(url)
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(res => res.json() as boolean)
    }

    getUser(id: number): Observable<User> {
        const url = this.userUrl + id;
        return this.http.get(url, ServiceUtil.buildAuthReqOpts())
            .map((res: Response) => res.json())
            .catch(ServiceUtil.handleError);
    }


    login(userName: string, userPassword: string): Observable<any> {
        return this.http.post(this.loginUrl,
            JSON.stringify({
                userName: userName,
                userPassword: userPassword
            }), {headers: this.jsonHeader})

            .map((response: Response) => {
                const user = response.json();

                if (user && user.token && user.userId && user.username && user.role) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    return MessageUtil.successMessage('logged in');
                }

                return MessageUtil.errorMessage('request success, but server did not return the proper response');
            })

            .catch(ServiceUtil.handleError);
    }

    logout() {
        sessionStorage.removeItem('currentUser');
    }


    /*
     * quick sign up
     *
     */
    signup(username: string, password: string, email: string): Observable<any> {
        const body: string = JSON.stringify({
            userName: username,
            userPassword: password,
            userEmail: email
        });
        return this.http.post(this.registerUrl, body, {headers: this.jsonHeader})
            .map((response: Response) => {
                return response.json();
            })
            .catch(ServiceUtil.handleError);
    }

    deleteUser(id: number): Observable<any> {
        const url = this.userUrl + id;
        return this.http.delete(url, ServiceUtil.buildAuthReqOpts())
            .map((response: Response) => {
                return response.json();
            })
            .catch(ServiceUtil.handleError);
    }

    add(user: User): Observable<any> {
        return this.http.post(this.userUrl, JSON.stringify(user), ServiceUtil.buildAuthReqOpts())
            .map(res => res.json())
            .catch(ServiceUtil.handleError);
    }

    update(user: User): Observable<string> {
        const url = this.userUrl;
        return this.http.put(url, JSON.stringify(user), ServiceUtil.buildAuthReqOpts())
            .map((res: Response) => ServiceUtil.handleSuccess(res))
            .catch(ServiceUtil.handleError)
    }


}
