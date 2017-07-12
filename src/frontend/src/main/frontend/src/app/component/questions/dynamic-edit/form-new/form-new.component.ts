import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../../services/question.service";
import {FormGroup} from "@angular/forms";
import {DynamicFormModel} from "../../../../models/dynamic-form.model";
import {Location} from "@angular/common";
import {QuestionBuilder} from "../../../../services/question-builder";

@Component({
    selector: 'app-form-new',
    templateUrl: './form-new.component.html',
    styleUrls: ['./form-new.component.scss']
})
export class FormNewComponent implements OnInit {
    formGroup: FormGroup;
    formObject: DynamicFormModel;

    constructor(private qtService: QuestionService,
                private location: Location) { }

    ngOnInit() {
        this.formObject = this.qtService.getStartForm();
        this.formGroup = QuestionBuilder.toEditFromGroup(this.formObject);
    }

    goBack() {
        this.location.back();
    }
}
