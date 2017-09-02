import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../../../../models/form/question-base';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-question-view',
    templateUrl: './question-view.component.html',
    styleUrls: ['./question-view.component.scss']
})
export class QuestionViewComponent implements OnInit {
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
