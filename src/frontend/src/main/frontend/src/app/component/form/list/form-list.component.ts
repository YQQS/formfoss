import { Component, OnInit } from '@angular/core';
import {FormModel} from '../../../models/form/form.model';
import {QuestionService} from '../../../services/question.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AlertService} from '../../../services/alert.service';
import {ServiceUtil} from '../../../util/service.util';
import {AuthenticatedUser} from '../../../models/authenticatedUser';
import {MdSlideToggleChange} from '@angular/material';


@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
    formList: FormModel[];
    onlyMe = true;
    currentUser: AuthenticatedUser;

    constructor(private qtService: QuestionService,
                private router: Router,
                private alertService: AlertService) { }

    getForms() {
        if (ServiceUtil.isAdmin() && !this.onlyMe) {
            this.getAllForms();
        } else {
            this.getOwnForms();
        }
    }

    getOwnForms() {
        this.qtService.getFormsByUserId(this.currentUser.userId)
            .subscribe(res => this.formList = res,
                (msg: string) => this.alertService.error(msg));
    }

    getAllForms() {
        this.qtService.getAllForms()
            .subscribe(res => this.formList = res,
                msg => this.alertService.error(msg));
    }

    updateList(event: MdSlideToggleChange) {
        this.onlyMe = event.checked;
        this.getForms();
    }


    ngOnInit() {
        this.currentUser = ServiceUtil.getCurrentUser();
        this.getForms();
    }

    deleteForm(id: number) {
        this.qtService.deleteForm(id)
            .subscribe(res => {
                if (res.message) {
                    this.alertService.success(res.message);
                }
                this.getForms();
            }, error => this.alertService.error(error))

    }

    publish(form: FormModel) {
        const fid = form.formId;
        this.qtService.publish(fid)
            .subscribe(res => {
                this.alertService.success(res.message || 'published');
                this.getForms();
            }, error => this.alertService.error(error));
    }

    edit(form: FormModel) {
        this.router.navigate(['/question', form.formId, 'edit']);
    }

    preview(id: number) {
        this.router.navigate(['/question', id, 'view']);
    }

    stats(id: number) {
        this.router.navigate(['/question', id, 'stat']);
    }

    add() {
        this.router.navigate(['/question', 'new'])
    }

}
