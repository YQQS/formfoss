import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../models/user";
import {AnswerModel} from "../../../../models/answer/answer.model";
import {FormModel} from "../../../../models/form/form.model";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Location} from "@angular/common";
import 'rxjs/add/operator/switchMap';
import {QuestionService} from "../../../../services/question.service";
import {QuestionBase} from "../../../../models/form/question-base";
import {QuestionDropDown} from "../../../../models/form/question-dropdown";
import {Angular2Csv} from 'angular2-csv';
import {FormUtil} from '../../../../util/form.util';

@Component({
    selector: 'app-user-stat',
    templateUrl: './user-stat.component.html',
    styleUrls: ['./user-stat.component.scss']
})
export class UserStatComponent implements OnInit {
    user: User;
    form: FormModel;
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
                const formId = +params.get('id');
                return this.qtService.getFormByFormId(formId);
            })
            .subscribe((form: FormModel) => {
                this.form = form;
                this.qtService.getAllAnswersOfForm(this.form.formId)
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

    download() {
        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: true,
            useBom: true
        };
        const aCsv = new Angular2Csv(FormUtil.createAnswerList(this.answers), this.form.title, options);
    }

}
