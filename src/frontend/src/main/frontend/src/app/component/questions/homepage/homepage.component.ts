import { Component, OnInit } from '@angular/core';
import {DynamicFormModel} from "../../../models/dynamic-form.model";
import {QuestionService} from "../../../services/question.service";
import {Router} from "@angular/router";
import {Subject} from 'rxjs/Subject';


@Component({
    selector: 'app-question-list',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomePageComponent implements OnInit {
    questionList: DynamicFormModel[];

    constructor(private qtService: QuestionService,
                private router: Router) { }

    getPublished() {
        this.qtService.getPublished()
            .subscribe( res => this.questionList = res,
                        error => alert(error));
    }


    ngOnInit() {
        this.getPublished();
    }



    preview(id: number) {
        this.router.navigate(['/questions', id])
    }

    stats(id: number) {

    }

    add() {
        this.router.navigate(['/questions/new'])
    }

}
