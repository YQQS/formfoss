import {Component, Input, OnInit} from '@angular/core';
import {QuestionBase} from '../../../../models/form/question-base';
import {AnswerBase} from '../../../../models/answer/answer-base';
import {QuestionDropDown} from '../../../../models/form/question-dropdown';

@Component({
    selector: 'app-question-answered-view',
    templateUrl: './question-answered-view.component.html',
    styleUrls: ['./question-answered-view.component.scss']
})
export class QuestionAnsweredViewComponent implements OnInit {
    @Input() question: QuestionBase<any>;
    @Input() answer: AnswerBase<any>;

    isSelected(source: string[], key: string): boolean {
        return source.includes(key);
    }

    constructor() { }

    ngOnInit() {
    }

    get answered() {
        return this.answer.answer;
    }

    get allOptions(): {key: string, value: string}[] {
        if (this.question instanceof QuestionDropDown) {
            return this.question.options;
        }
        return [];
    }

    get allOptionsValue(): string[] {
        if (this.question instanceof QuestionDropDown) {
            return this.question.options.map(item => item.value);
        } else {
            return [];
        }
    }

    get allOptionsKey(): string[] {
        if (this.question instanceof QuestionDropDown) {
            return this.question.options.map(item => item.key);
        }
        return [];
    }

}
