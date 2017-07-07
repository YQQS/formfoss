import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { User } from '../models/user';

@Injectable()
export class UserService {
    private userUrl = '/users/';
    private jsonHeader = new Headers({'Content-Type': 'application/json'});
    private formHeader = new Headers({"Content-Type": "application/x-www-form-urlencoded"});

    constructor(private http: Http) { }

    getAll(userName?: string, userEmail?: string, fuzzy: boolean = false) : Promise<User[]> {
        let url: string = this.userUrl + '?fuzzy=' + fuzzy;
        if (userName) {
            url += ('&userName=' + userName);
        }
        if (userEmail) {
            url += ('&userEmail=' + userEmail);
        }
        return this.http.get(url)
            .toPromise()
            .then(response => {
                return JSON.parse(response.text());
                }
            )
            .catch(this.handleError);
    }

    getUser(id: number) : Promise<User> {
        const url = this.userUrl + id;
        return this.http.get(url)
            .toPromise()
            .then((response: Response) => {
                return response.json() as User;
            })
            .catch(this.handleError);
    }




    login(userName: string, userPassword: string): Promise<any> {
        //let body = {userName: userName, userPassword: userPassword};
        let body: string = "userName=" + userName + "&userPassword=" + userPassword;
        return this.http.post(this.userUrl + 'login', body, {headers: this.formHeader})
            .toPromise()
            .then((response: Response) => {
                return JSON.parse(response.text())
            })
            .catch(this.handleError);
    }


    add(username: string, password: string, email: string): Promise<any> {
        let body: string = JSON.stringify({
            userName: username,
            userPassword: password,
            userEmail: email
        });
        return this.http.post(this.userUrl, body, {headers: this.jsonHeader})
            .toPromise()
            .then((response: Response) => {
                return JSON.parse(response.text());
            })
            .catch(this.handleError);
    }

    deleteUser(id: number): Promise<any> {
        const url = this.userUrl + id;
        return this.http.delete(url, {headers: this.formHeader})
            .toPromise()
            .then((response: Response) => {
                return response;
            })
            .catch(this.handleError);
    }

    update(user: User): Promise<User> {
        const url = this.userUrl;
        return this.http.put(url, JSON.stringify(user), {headers: this.jsonHeader})
            .toPromise()
            .then(() => {
                return user;
            })
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
