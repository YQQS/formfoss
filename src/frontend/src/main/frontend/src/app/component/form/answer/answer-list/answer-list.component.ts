import { Component, OnInit } from '@angular/core';
import {QuestionService} from '../../../../services/question.service';
import {AnswerModel} from '../../../../models/answer/answer.model';
import {AlertService} from '../../../../services/alert.service';
import {ServiceUtil} from '../../../../util/service.util';
import {Router} from '@angular/router';

@Component({
    selector: 'app-answer-list',
    templateUrl: './answer-list.component.html',
    styleUrls: ['./answer-list.component.scss']
})
export class AnswerListComponent implements OnInit {
    // answers submitted
    submittedAnswers: AnswerModel[];

    // answers that not submitted
    unSubmittedAnswers: AnswerModel[];

    constructor(private qtService: QuestionService,
                private alertService: AlertService,
                private router: Router) { }

    ngOnInit() {
        this.getSubmittedAnswers();
        this.getUnSubmittedAnswers();
    }

    getSubmittedAnswers() {
        this.qtService.getAnswerListOfUser(ServiceUtil.getCurrentUser().userId, true)
            .subscribe(res => this.submittedAnswers = res,
                error => this.alertService.error(error));
    }

    getUnSubmittedAnswers() {
        this.qtService.getAnswerListOfUser(ServiceUtil.getCurrentUser().userId, false)
            .subscribe(res => this.unSubmittedAnswers = res,
                error => this.alertService.error(error));
    }

    goDetail(answer: AnswerModel) {
        this.router.navigate(['answer', answer.answerId]);
    }

    deleteAnswer(answer: AnswerModel) {
        this.qtService.deleteAnswerByAnswerId(answer.answerId)
            .subscribe(res => {
                this.alertService.success(res['message'] || JSON.stringify(res))
                this.ngOnInit();
                },
                error => this.alertService.error(error));
    }

}
