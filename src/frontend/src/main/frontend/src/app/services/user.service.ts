import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private headers = new Headers({'Content-Type': 'application/json'});

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
        let theHeaders = new Headers({'content-type': 'application/x-www-form-urlencoded'});
        let body: string = "userName=" + userName + "&userPassword=" + userPassword;
        return this.http.post('/user/login', body, theHeaders)
            .map((response: Response) => {
                console.log(response.json());
                return JSON.parse(response.text())
            });
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
