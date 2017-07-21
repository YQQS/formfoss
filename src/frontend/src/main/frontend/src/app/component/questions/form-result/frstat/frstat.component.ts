import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../../services/question.service";
import {ResultModel} from "../../../../models/result/result.model";
import {DynamicFormModel} from "../../../../models/dynamic-form.model";
import {ChartModel} from "../../../../models/result/chart.model";
import {QuestionBuilder} from "../../../../services/question-builder";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import 'rxjs/add/operator/switchMap';
import {CSV} from 'csv.js';

@Component({
    selector: 'app-frstat',
    templateUrl: './frstat.component.html',
    styleUrls: ['./frstat.component.scss']
})
export class FRStatComponent implements OnInit {
    formData: ResultModel;
    formModel: DynamicFormModel;
    chartModels: ChartModel[];

    constructor(private qtService: QuestionService,
                private router: ActivatedRoute,
                private route: Router,
                private location: Location) { }

    ngOnInit() {
        this.router.paramMap
            .switchMap((params: ParamMap) => {
                let id: number = +params.get('id');
                return this.qtService.getFormData(id);
            })
            .subscribe((formData) => {
                    this.formData = formData;
                    this.qtService.getForm(formData.formId)
                        .subscribe(res => {
                            this.formModel = res;
                            this.chartModels = QuestionBuilder.toChartModels(
                                this.formData,
                                this.formModel
                            );
                            console.log(this.chartModels);
                        })
                },
                error => alert(error));
    }

    back() {
        this.location.back();
    }

    goIndividual() {
        this.route.navigate(['/formUserStat', this.formModel.formId]);
    }

    download() {
        let csvcontent = "data:text/csv;charset=utf-8,";
        this.chartModels.forEach(item => {
            let dataString = item.label.join(',');
            csvcontent += (dataString + '\n');
            csvcontent += (item.data.join(',') + '\n');
        });

        console.log(csvcontent);

        let encodeUrl = encodeURI(csvcontent);
        let csvElement = <HTMLLinkElement> document.getElementById('csv-link');
        csvElement.href = encodeUrl;
    }

}
