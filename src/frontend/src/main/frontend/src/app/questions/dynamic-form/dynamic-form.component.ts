import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from "../question-base";
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../../services/question.service";
import {DynamicFormModel} from '../dynamic-form.model';

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
    providers: [ QuestionService ]
})
export class DynamicFormComponent implements OnInit {
    //@Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: DynamicFormModel;
    @Input() form: FormGroup;
    payLoad = '';

    constructor(private qtService: QuestionService) { }

    ngOnInit() {
        this.formObject = this.formObject ? this.formObject : this.qtService.getDynamicFormModel();
        this.form = this.qtService.toFormGroup(this.formObject.questions);
    }

    onSubmit() {
        this.payLoad = JSON.stringify(this.form.value);
    }

}
