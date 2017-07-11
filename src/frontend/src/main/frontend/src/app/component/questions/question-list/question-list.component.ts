import { Component, OnInit } from '@angular/core';
import {DynamicFormModel} from "../../../models/dynamic-form.model";
import {QuestionService} from "../../../services/question.service";
import {Router} from "@angular/router";


@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.scss']
})
export class QuestionListComponent implements OnInit {
    questionList: DynamicFormModel[];

    constructor(private qtService: QuestionService,
                private router: Router) { }

    getAll() {
        this.qtService.getAll()
            .subscribe( res => this.questionList = res,
                        error => alert(error));
    }

    ngOnInit() {
        this.getAll();
    }

    delete(id: number) {
        this.qtService.delete(id)
            .subscribe(res => {
                if (res.message) {
                    alert(res.message);
                }
            }, error => alert(error))

        //refresh
        this.getAll();
    }

    edit(id: number) {
        this.router.navigate(['/questions/edit', id])
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
