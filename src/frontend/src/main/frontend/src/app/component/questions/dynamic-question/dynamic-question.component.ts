import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from "../../../models/question-base";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'dynamic-question',
    templateUrl: './dynamic-question.component.html',
    styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent implements OnInit {
    @Input() question: QuestionBase<any>;
    @Input() form: FormGroup;

    getErrors() {
        return this.form.get(this.question.key).errors;
    }

    getFormControl() {
        return this.form.get(this.question.key);
    }

    constructor() { }

    ngOnInit() {
    }

}
