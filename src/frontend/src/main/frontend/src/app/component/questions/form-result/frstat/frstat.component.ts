import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../../services/question.service";
import {ResultModel} from "../../../../models/result/result.model";
import {DynamicFormModel} from "../../../../models/dynamic-form.model";
import {ChartModel} from "../../../../models/result/chart.model";
import {QuestionBuilder} from "../../../../services/question-builder";

@Component({
    selector: 'app-frstat',
    templateUrl: './frstat.component.html',
    styleUrls: ['./frstat.component.scss']
})
export class FRStatComponent implements OnInit {
    formData: ResultModel;
    formModel: DynamicFormModel;
    chartModels: ChartModel[];

    constructor(private qtService: QuestionService) { }

    ngOnInit() {
        this.qtService.getFormData(17)
            .subscribe(res => {
                    this.formData = res;
                    this.qtService.getForm(17)
                        .subscribe(res => {
                            this.formModel = res
                            this.chartModels = QuestionBuilder.toChartModels(
                                this.formData,
                                this.formModel
                            );
                            console.log(this.chartModels);
                        })
                    },
                    error => alert(error));

    }



}
