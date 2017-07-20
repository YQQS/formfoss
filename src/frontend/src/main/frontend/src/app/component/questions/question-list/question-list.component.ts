import { Component, OnInit } from '@angular/core';
import {DynamicFormModel} from "../../../models/dynamic-form.model";
import {QuestionService} from "../../../services/question.service";
import {Router} from "@angular/router";
import {Subject} from 'rxjs/Subject';


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

    search(str: string) {

    }

    ngOnInit() {
        this.getAll();
    }

    deleteForm(id: number) {
        this.qtService.delete(id)
            .subscribe(res => {
                if (res.message) {
                    alert(res.message);
                }
                this.getAll();
            }, error => alert(error))

    }

    publish(uid:number,fid:number){
        this.qtService.publish(uid,fid)
            .subscribe(res=>{
                if(res.message && res.url) {
                    alert(res.message+".You can release your form throw url:"+res.url);
                }
                else if(res.message){
                    alert(res.message);
                }
            })
    }

    edit(id: number) {
        this.router.navigate(['/questions/edit', id])
    }

    preview(id: number) {
        this.router.navigate(['/questions', id])
    }

    stats(id: number) {
        this.router.navigate(['/formStat', id]);
    }

    add() {
        this.router.navigate(['/questions/new'])
    }

}
