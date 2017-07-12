import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../../../services/question.service";
import {DynamicFormModel} from '../../../models/dynamic-form.model';
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {Location} from "@angular/common";
import {QuestionBuilder} from "../../../services/question-builder";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
    //@Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: DynamicFormModel;
    @Input() @Output() form: FormGroup;
    payLoad = '';

    constructor(private qtService: QuestionService,
                private router: ActivatedRoute,
                private location: Location) { }

    ngOnInit() {
    }


    onSubmit() {
        this.payLoad = JSON.stringify(QuestionBuilder.buildAnswerModel(
            this.form, this.formObject
        ));
        this.qtService.submitAnswer(this.form, this.formObject)
            .subscribe(res => alert(res.message),
                error => alert(error))
    }

    save() {
        this.qtService.saveAnswer(this.form, this.formObject)
            .subscribe(res => {
                console.log(res);
                alert(res.message)
                },
                error => alert(error));
    }

}
