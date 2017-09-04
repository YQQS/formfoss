import { Component, OnInit } from '@angular/core';
import {FormModel} from '../../../models/form/form.model';
import {QuestionService} from '../../../services/question.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AlertService} from '../../../services/alert.service';
import {ServiceUtil} from '../../../util/service.util';
import {error} from 'selenium-webdriver';


@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
    questionList: FormModel[];

    constructor(private qtService: QuestionService,
                private router: Router,
                private alertService: AlertService) { }

    getForms() {
        if (ServiceUtil.isAdmin()) {
            this.getAllForms();
        } else {
            this.getOwnForms();
        }
    }

    getOwnForms() {
        this.qtService.getFormsByUserId(ServiceUtil.getCurrentUser().userId)
            .subscribe(res => this.questionList = res,
                (msg: string) => this.alertService.error(msg));
    }

    getAllForms() {
        this.qtService.getAllForms()
            .subscribe(res => this.questionList = res,
                msg => this.alertService.error(msg));
    }


    ngOnInit() {
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

    publish(uid: number, fid: number) {
        this.qtService.publish(uid, fid)
            .subscribe(res => {
                if(res.message && res.url) {
                    this.alertService.success(res.message + '.You can release your form throw url:' + res.url);
                    let x=document.getElementById(fid.toString());
                    x.innerHTML="Published";
                }
                else if(res.message){
                    this.alertService.error(res.message);
                    let x=document.getElementById(fid.toString());
                    x.innerHTML="Unpublished";
                }
            })
    }

    edit(id: number) {
        this.router.navigate(['/question', id, 'edit']);
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
