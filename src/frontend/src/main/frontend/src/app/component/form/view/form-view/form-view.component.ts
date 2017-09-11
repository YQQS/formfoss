import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionService} from '../../../../services/question.service';
import {FormModel} from '../../../../models/form/form.model';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {MdDialog} from '@angular/material';
import {SubmitPreviewComponent} from '../form-submit-preview/submit-preview.component';
import {AlertService} from '../../../../services/alert.service';
import {AuthenticatedUser} from '../../../../models/authenticatedUser';
import {ServiceUtil} from '../../../../util/service.util';
import {FormUtil} from '../../../../util/form.util';
import {QuestionBase} from '../../../../models/form/question-base';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html',
    styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
    // @Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: FormModel;
    @Input() formGroup: FormGroup;
    currentUser: AuthenticatedUser;
    previewMode: string;

    constructor(private qtService: QuestionService,
                private route: Router,
                private alertService: AlertService,
                public diaRef: MdDialog) { }

    ngOnInit() {
        this.currentUser = ServiceUtil.getCurrentUser();
        if (!this.formObject.isPublished) {
            this.alertService.error('form not published');
        }
        if (this.currentUser.userId === this.formObject.userId) {
            this.previewMode = 'owner';
        } else if (this.currentUser.role === 'admin') {
            this.previewMode = 'admin';
        } else {
            this.previewMode = 'normal';
        }
    }


    onSubmit() {
        const dialogRef = this.diaRef.open(SubmitPreviewComponent, {
            data: this.formGroup.value
        });
        dialogRef.afterClosed().subscribe((data: {confirm: boolean}) => {
            if (data.confirm) {
                this.qtService.submitAnswer(this.formGroup, this.formObject)
                    .subscribe(res => this.alertService.success(res['message'] || JSON.stringify(res)),
                        error => this.alertService.error(error))
            }
        })
    }

    save() {
        this.qtService.saveAnswer(this.formGroup, this.formObject)
            .subscribe(res => this.alertService.success(res.message),
                error => this.alertService.error(error));
    }

    getDependQuestion(question: QuestionBase<any>): QuestionBase<any> {
        if ( question.dependencies && question.dependencies.key) {
            return this.formObject.formItems.find(q => q.key === question.dependencies.key);
        } else {
            return null;
        }
    }

    log() {
        console.log(
            FormUtil.buildAnswerModel(this.formGroup, this.formObject)
        );
    }

    goToEdit() {
        this.route.navigate(['question', this.formObject.formId, 'edit']);
    }

    goToStat() {
        this.route.navigate(['question', this.formObject.formId, 'stat']);
    }

}
