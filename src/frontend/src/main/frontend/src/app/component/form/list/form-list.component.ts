import { Component, OnInit } from '@angular/core';
import {FormModel} from "../../../models/form/form.model";
import {QuestionService} from '../../../services/question.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AlertService} from '../../../services/alert.service';


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

    getAll() {
        this.qtService.getAll()
            .subscribe( res => this.questionList = res,
                        error => alert(error));
    }


    ngOnInit() {
        this.getAll();
    }

    deleteForm(id: number) {
        this.qtService.deleteForm(id)
            .subscribe(res => {
                if (res.message) {
                    this.alertService.success(res.message);
                }
                this.getAll();
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
        this.router.navigate(['/questions/edit', id])
    }

    preview(id: number) {
        this.router.navigate(['/questions', id])
    }

    stats(id: number) {
        this.router.navigate(['/formStat', id]);
    }

    add() {
        this.router.navigate(['/questions/new'])
    }

}
