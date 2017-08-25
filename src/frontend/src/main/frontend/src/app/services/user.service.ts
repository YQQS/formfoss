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

@Injectable()
export class UserService {
    private userUrl = '/users/';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});
    private formHeader = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});

    constructor(private http: Http) { }

    getAll(userName?: string, userEmail?: string, fuzzy: boolean = false): Observable<User[]> {
        let url: string = this.userUrl + `?fuzzy=${fuzzy}`;
        if (userName) {
            url += `&userName=${userName}`;
        }
        if (userEmail) {
            url += `&userEmail=${userEmail}`;
        }
        return this.http.get(url)
            .map(response => {
                return response.json() as User[];
                }
            )
            .catch(this.handleError);
    }

    nameConflict(name: string): Observable<boolean> {
        const url = this.userUrl + `validate?userName=${name}`;
        return this.http.get(url)
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(res => res.json() as boolean)
    }

    emailConflict(email: string): Observable<boolean> {
        const url = this.userUrl + `validate?userEmail=${email}`;
        return this.http.get(url)
            .debounceTime(1000)
            .distinctUntilChanged()
            .map(res => res.json() as boolean)
    }

    getUser(id: number): Observable<User> {
        const url = this.userUrl + id;
        return this.http.get(url)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }


    login(userName: string, userPassword: string): Observable<any> {
        return this.http.post(this.userUrl + 'login',
            JSON.stringify({
                userName: userName,
                userPassword: userPassword
            }), {headers: this.jsonHeader})

            .map((response: Response) => {
                const user = response.json();
                if (user
                    // && user.token
                 ) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            })

            .catch(this.handleError)
    }

    logout() {
        sessionStorage.removeItem('currentUser');
    }


    add(username: string, password: string, email: string): Observable<any> {
        const body: string = JSON.stringify({
            userName: username,
            userPassword: password,
            userEmail: email
        });
        return this.http.post(this.userUrl, body, {headers: this.jsonHeader})
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    deleteUser(id: number): Observable<any> {
        const url = this.userUrl + id;
        return this.http.delete(url, {headers: this.formHeader})
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.handleError);
    }

    update(user: User): Observable<User> {
        const url = this.userUrl;
        return this.http.put(url, JSON.stringify(user), {headers: this.jsonHeader})
            .map((res: Response) => res.json() as User)
            .catch(this.handleError)
    }

    private handleError(error: Response | any)  {
        let errMsg: string;
        if (error instanceof Response) {
            console.error(error.json());
            const body = error.json() || '';
            const err = body.errorMsg || body.message || JSON.stringify(error);
            errMsg = `${error.status} - ${error.statusText || ''}: ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    private build_reqOpts() {
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({
                'Authorization': 'formfoss ' + currentUser.token
            });

            return new RequestOptions({headers: headers});
        }
    }

}
