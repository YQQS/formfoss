import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    getAll() {
        return this.http.get('/user/all')
    }


    login(userName: string, userPassword: string) {
        let body = {userName: userName, userPassword: userPassword};
        return this.http.post('/user/login', JSON.stringify(body))
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
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