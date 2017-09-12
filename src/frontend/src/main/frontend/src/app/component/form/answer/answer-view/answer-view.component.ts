import {Component, Input, OnInit} from '@angular/core';
import {FormModel} from '../../../../models/form/form.model';
import {AnswerModel} from '../../../../models/answer/answer.model';
import {Router} from '@angular/router';
import {QuestionService} from '../../../../services/question.service';

@Component({
    selector: 'app-answer-view',
    templateUrl: './answer-view.component.html',
    styleUrls: ['./answer-view.component.scss']
})
export class AnswerViewComponent implements OnInit {
    @Input() form: FormModel;
    @Input() answer: AnswerModel;

    constructor(private router: Router,
                private qtService: QuestionService) { }

    ngOnInit() {
    }


}
