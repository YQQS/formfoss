import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../../services/question.service";
import {FormGroup} from "@angular/forms";
import {FormModel} from "../../../../models/form/form.model";
import {Location} from "@angular/common";
import {FormUtil} from "../../../../util/form.util";

@Component({
    selector: 'app-form-new',
    templateUrl: './form-new.component.html',
    styleUrls: ['./form-new.component.scss']
})
export class FormNewComponent implements OnInit {
    formGroup: FormGroup;
    formObject: FormModel;

    constructor(private qtService: QuestionService,
                private location: Location) { }

    ngOnInit() {
        this.formObject = this.qtService.getStartForm();
        this.formGroup = FormUtil.toFromEditGroup(this.formObject);
    }

    goBack() {
        this.location.back();
    }
}
