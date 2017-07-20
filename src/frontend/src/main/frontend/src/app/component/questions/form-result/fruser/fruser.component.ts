import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../models/user";
import {AnswerModel} from "../../../../models/answer.model";
import {DynamicFormModel} from "../../../../models/dynamic-form.model";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Location} from "@angular/common";
import 'rxjs/add/operator/switchMap';
import {QuestionService} from "../../../../services/question.service";
import {QuestionBase} from "../../../../models/question-base";
import {QuestionDropDown} from "../../../../models/question-dropdown";

@Component({
    selector: 'app-fruser',
    templateUrl: './fruser.component.html',
    styleUrls: ['./fruser.component.scss']
})
export class FRUserComponent implements OnInit {
    user: User;
    form: DynamicFormModel;
    answers: AnswerModel[];

    colors: string[] = ['primary', 'accent', 'warn'];

    constructor(private router: ActivatedRoute,
                private location: Location,
                private qtService: QuestionService) { }

    randomColor(i: number): string {
        let index: number = i % 3;
        return this.colors[index];
    }

    ngOnInit() {
        this.router.paramMap
            .switchMap((params: ParamMap) => {
                let formId = +params.get('id');
                return this.qtService.getForm(formId);
            })
            .subscribe((form: DynamicFormModel) => {
                this.form = form;
                this.qtService.getUserAnswers(this.form.formId)
                    .subscribe(answers => {
                        this.answers = answers;
                    })
            })
    }

    back() {
        this.location.back();
    }

    selectedValue(selected: string, question: QuestionDropDown): string {
        let opts = question.options;
        let selectedValues = opts.filter(item => item.key === selected).map(item => item.value);
        if (selectedValues.length != 1) {
            return '';
        }
        return  selectedValues[0];
    }


}
