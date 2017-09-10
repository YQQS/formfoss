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
    @Input() formGroup: FormGroup;

    getErrors() {
        return this.formGroup.get(this.question.key).errors;
    }

    getFormControl() {
        return this.formGroup.get(this.question.key);
    }

    constructor() { }

    ngOnInit() {
    }

}
