import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QuestionService} from '../../../../services/question.service';
import {FormModel} from '../../../../models/form/form.model';
import {ActivatedRoute, ParamMap} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {Location} from '@angular/common';
import {FormUtil} from '../../../../util/form.util';
import {MdDialog} from '@angular/material';
import {SubmitPreviewComponent} from '../form-submit-preview/submit-preview.component';
import {AlertService} from '../../../../services/alert.service';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html',
    styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
    // @Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: FormModel;
    @Input() form: FormGroup;
    payLoad = '';

    constructor(private qtService: QuestionService,
                private router: ActivatedRoute,
                private alertService: AlertService,
                public diaRef: MdDialog) { }

    ngOnInit() {
    }


    onSubmit() {
        const dialogRef = this.diaRef.open(SubmitPreviewComponent, {
            data: this.form.value
        });
        dialogRef.afterClosed().subscribe((data: {confirm: boolean}) => {
            if (data.confirm) {
                this.qtService.submitAnswer(this.form, this.formObject)
                    .subscribe(res => this.alertService.success(res['message'] || JSON.stringify(res)),
                        (error: string) => this.alertService.error(error))
            }
        })
    }

    save() {
        this.qtService.saveAnswer(this.form, this.formObject)
            .subscribe(res => {
                alert(res.message)
                },
                error => alert(error));
    }

}
