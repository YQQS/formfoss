import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {FormModel} from '../../../../models/form/form.model';
import {QuestionService} from '../../../../services/question.service';
import {FormGroup} from '@angular/forms';
import {FormUtil} from '../../../../util/form.util';

@Component({
    selector: 'app-form-preview',
    templateUrl: './form-preview.component.html',
    styleUrls: ['./form-preview.component.scss']
})
export class FormPreviewComponent implements OnInit {
    formObject: FormModel;
    formGroup: FormGroup;

    constructor(private router: ActivatedRoute,
                private location: Location,
                private qtService: QuestionService) { }

    ngOnInit() {
        this.router.paramMap
            .switchMap((params: ParamMap) => {
                return this.qtService.getForm(+params.get('id'))
            })
            .subscribe((form: FormModel) => {
                this.formObject = form;
                this.formGroup = FormUtil.toFormViewGroup(this.formObject.formItems);
            });
    }

    goBack() {
        this.location.back();
    }

}
