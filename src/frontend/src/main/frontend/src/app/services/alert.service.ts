import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {NavigationStart, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavOnChange = false;

    constructor(private router: Router) {
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavOnChange) {
                    this.keepAfterNavOnChange = false;
                } else {
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keep = false) {
        this.keepAfterNavOnChange = keep;
        this.subject.next({
            type: 'success',
            text: message
        });
    }

    error(message: string, keep = false) {
        this.keepAfterNavOnChange = keep;
        this.subject.next({
            type: 'error',
            text: message
        })
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

}
