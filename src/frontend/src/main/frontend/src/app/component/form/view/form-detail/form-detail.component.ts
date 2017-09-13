import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormModel} from '../../../../models/form/form.model';
import {QuestionService} from '../../../../services/question.service';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../util/form.util';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticatedUser} from '../../../../models/authenticatedUser';
import {ServiceUtil} from '../../../../util/service.util';
import {SubmitPreviewComponent} from '../form-submit-preview/submit-preview.component';
import {MdDialog} from '@angular/material';
import {AnswerModel} from '../../../../models/answer/answer.model';

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-detail.component.html',
    styleUrls: ['./form-detail.component.scss']
})
export class FormDetailComponent implements OnInit {
    formObject: FormModel;
    formGroup: FormGroup;
    answerModel: AnswerModel;

    constructor(private activatedRoute: ActivatedRoute,
                private location: Location,
                private router: Router,
                private qtService: QuestionService,
                private alertService: AlertService,
                public diaRef: MdDialog) { }

    ngOnInit() {
        const isPublished = this.activatedRoute.snapshot.queryParams['isPublished'] || false;
        const answerId = this.activatedRoute.snapshot.queryParams['answerId'] || null;
        const formId = +this.activatedRoute.snapshot.params['id'];

        if (isPublished) {
            this.qtService.getPublishedFormById(formId)
                .subscribe(res => {
                    this.formObject = res;
                    this.formGroup = FormUtil.formModelToViewGroup(this.formObject.formItems);
                    this.answerModel = null;
                }, error => this.alertService.error(error));
        } else {
            this.qtService.getAnswerByAnswerId(answerId)
                .subscribe(res => {
                    this.answerModel = res;
                    this.getForm(formId);
                    },
                    error => {
                        this.answerModel = null;
                        this.getForm(formId);
                    });
        }
    }

    getForm(formId: number) {
        this.qtService.getFormByFormId(formId)
            .subscribe(res => {
                this.formObject = res;
                if (this.answerModel !== null) {
                    this.formGroup = FormUtil.formModelToViewGroup(this.formObject.formItems, this.answerModel || null);
                } else {
                    this.formGroup = FormUtil.formModelToViewGroup(this.formObject.formItems);
                }
            }, error => this.alertService.error(error));
    }

    hasPrivilege(): boolean {
        if (!ServiceUtil.isLoggedIn()) {
            return false;
        }

       const currentUser: AuthenticatedUser = ServiceUtil.getCurrentUser();
       return currentUser.userId === this.formObject.userId || currentUser.role === 'admin';
    }


    goBack() {
        this.location.back();
    }

    edit() {
        this.router.navigate(['question', this.formObject.formId, 'edit']);
    }

    onSubmit() {
        const dialogRef = this.diaRef.open(SubmitPreviewComponent, {
            width: '60%',
            data: {
                form: this.formObject,
                answer: FormUtil.buildAnswerModel(this.formGroup, this.formObject)
            }
        });
        dialogRef.afterClosed().subscribe((data: {confirm: boolean}) => {
            if (data.confirm) {
                this.updateAnswer();
                this.qtService.submitAnswer(this.answerModel)
                    .subscribe(res => this.alertService.success(res['message'] || JSON.stringify(res)),
                        error => this.alertService.error(error))
            }
        })
    }

    save() {
        this.updateAnswer();
        this.qtService.saveAnswer(this.answerModel)
            .subscribe(res => this.alertService.success(res.message),
                error => this.alertService.error(error));
    }

    updateAnswer() {
        if (this.answerModel !== null && this.answerModel.answerId !== null) {
            let answerId = this.answerModel.answerId || null;
            this.answerModel = FormUtil.buildAnswerModel(this.formGroup, this.formObject);
            this.answerModel.answerId = answerId;
        } else {
            this.answerModel = FormUtil.buildAnswerModel(this.formGroup, this.formObject);
        }
    }

    log() {
        console.log(
            FormUtil.buildAnswerModel(this.formGroup, this.formObject)
        );
    }

    goToStat() {
        this.router.navigate(['question', this.formObject.formId, 'stat']);
    }
}
