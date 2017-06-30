import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private theHeaders = new Headers({"Content-Type": "application/x-www-form-urlencoded"});

    constructor(private http: Http) { }

    getAll() : Promise<User[]> {
        return this.http.get('/user/all')
            .toPromise()
            .then(response => {
                return JSON.parse(response.text());
                }
            )
            .catch(this.handleError);
    }



    login(userName: string, userPassword: string) {
        //let body = {userName: userName, userPassword: userPassword};
        let body: string = "userName=" + userName + "&userPassword=" + userPassword;
        return this.http.post('/user/login', body, {headers: this.theHeaders})
            .map((response: Response) => {
                return JSON.parse(response.text())
            });
    }

    add(username: string, password: string, email: string) {
        let body: string = "userName=" + username +
            "&userPassword=" + password +
            "&userEmail=" + email;
        return this.http.post('/user/add', body, {headers: this.theHeaders})
            .map((response: Response) => {
                return JSON.parse(response.text());
            })
    }

    delete(id: number) {
        let body: string = "userId=" + id;
        return this.http.post('/user/del', body, {headers: this.theHeaders})
            .map(response => JSON.parse(response.text()));

    }

    private jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({'Authorization': 'Bearer' + currentUser.token});
            return new RequestOptions({headers: headers});
        }
    }

    private handleError(error: any) : Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
