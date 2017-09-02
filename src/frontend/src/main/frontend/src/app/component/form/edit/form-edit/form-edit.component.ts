import { Component, OnInit } from '@angular/core';
import {FormModel} from "../../../../models/form/form.model";
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../../../../services/question.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Location} from '@angular/common';
import {FormUtil} from "../../../../util/form.util";

@Component({
    selector: 'app-form-edit',
    templateUrl: './form-edit.component.html',
    styleUrls: ['./form-edit.component.scss']
})
export class FormEditComponent implements OnInit {
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
                this.formGroup = FormUtil.toFromEditGroup(this.formObject);
            })
    }

    goBack() {
        this.location.back();
    }
}
