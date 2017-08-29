import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import {AlertService} from '../../../services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
    message: any;
    subscription: Subscription;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage()
            .subscribe(message => { this.message = message; });
    }

    ngOnDestroy() {
        // unsubscribe on destroy to prevent memory leaks
        this.subscription.unsubscribe();
    }
}
