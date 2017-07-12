import { Component, OnInit } from '@angular/core';
import {DynamicFormModel} from "../../../../models/dynamic-form.model";
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../../../../services/question.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Location} from '@angular/common';

@Component({
    selector: 'app-form-edit',
    templateUrl: './form-edit.component.html',
    styleUrls: ['./form-edit.component.scss']
})
export class FormEditComponent implements OnInit {
    formObject: DynamicFormModel;
    formGroup: FormGroup;

    constructor(private router: ActivatedRoute,
                private location: Location,
                private qtService: QuestionService) { }


    ngOnInit() {
        this.router.paramMap
            .switchMap((params: ParamMap) => {
                return this.qtService.getForm(+params.get('id'))
            })
            .subscribe((form: DynamicFormModel) => {
                this.formObject = form;
                this.formGroup = this.qtService.toEditFromGroup(this.formObject);
            })
    }

    goBack() {
        this.location.back();
    }
}
