import { Component, OnInit } from '@angular/core';
import {FormModel} from '../../../models/form/form.model';
import {QuestionService} from '../../../services/question.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AlertService} from '../../../services/alert.service';


@Component({
    selector: 'app-form-list',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    questionList: FormModel[];

    constructor(private qtService: QuestionService,
                private router: Router,
                private alertService: AlertService) { }

    getPublished() {
        this.qtService.getPublishedForms()
            .subscribe( res => this.questionList = res,
                        error => this.alertService.error(error));
    }


    ngOnInit() {
        this.getPublished();
    }



    view(id: number) {
        this.router.navigate(['/question', id], {
            queryParams: {
                isPublished: true
            }
        })
    }

    stats(id: number) {

    }

    add() {
        this.router.navigate(['/questions/new'])
    }

}
