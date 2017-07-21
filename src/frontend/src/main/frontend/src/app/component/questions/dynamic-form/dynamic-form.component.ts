import {Component, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {QuestionService} from "../../../services/question.service";
import {DynamicFormModel} from '../../../models/dynamic-form.model';
import {ActivatedRoute, ParamMap} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {Location} from "@angular/common";
import {QuestionBuilder} from "../../../services/question-builder";
import {MdDialog} from "@angular/material";
import {SubmitPreviewComponent} from "./submit-preview/submit-preview.component";

@Component({
    selector: 'dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
    //@Input() questions: QuestionBase<any>[] = [];
    @Input() formObject: DynamicFormModel;
    @Input() form: FormGroup;
    payLoad = '';

    constructor(private qtService: QuestionService,
                private router: ActivatedRoute,
                public diaRef: MdDialog) { }

    ngOnInit() {
    }


    onSubmit() {
        let dialogRef = this.diaRef.open(SubmitPreviewComponent, {
            data: this.form.value
        });
        dialogRef.afterClosed().subscribe((data: {confirm: boolean}) => {
            if (data.confirm) {
                this.qtService.submitAnswer(this.form, this.formObject)
                    .subscribe(res => alert(res.message),
                        error => alert(error))
            }
        })
    }

    save() {
        this.qtService.saveAnswer(this.form, this.formObject)
            .subscribe(res => {
                alert(res.message)
                },
                error => alert(error));
    }

}
