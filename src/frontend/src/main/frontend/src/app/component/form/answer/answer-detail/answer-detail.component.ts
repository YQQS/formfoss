import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QuestionService} from '../../../../services/question.service';
import {AlertService} from '../../../../services/alert.service';
import {AnswerModel} from '../../../../models/answer/answer.model';
import {FormModel} from '../../../../models/form/form.model';
import {Location} from '@angular/common';

@Component({
    selector: 'app-answer-detail',
    templateUrl: './answer-detail.component.html',
    styleUrls: ['./answer-detail.component.scss']
})
export class AnswerDetailComponent implements OnInit {
    answer: AnswerModel;
    form: FormModel;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private qtService: QuestionService,
                private alertService: AlertService) { }

    ngOnInit() {
        const answerId = +this.activatedRoute.snapshot.params['id'];
        this.qtService.getAnswerByAnswerId(answerId)
            .subscribe(res => {
                    this.answer = res;
                    this.qtService.getFormByFormId(this.answer.formId)
                        .subscribe(form => this.form = form,
                            e => this.alertService.error(e));
                },
                error => this.alertService.error(error)
            );
    }

    changeAnswer() {
        this.router.navigate(['question', this.form.formId, 'view'], {
            queryParams: {
                answerId: this.answer.answerId
            }
        });
    }

    isSubmitted(): boolean {
        return this.answer.commitflag;
    }

    deleteAnswer() {
        this.qtService.deleteAnswerByAnswerId(this.answer.answerId)
            .subscribe(res => {
                this.router.navigate(['answer', 'list'])
                    .then(() => this.alertService.success(res['message'] || JSON.stringify(res)))
            }, error => this.alertService.error(error));
    }

    goBack() {
        this.location.back();
    }

}
