import { Component, OnInit } from '@angular/core';
import {QuestionService} from "../../../../services/question.service";
import {FormResultModel} from "../../../../models/result/form-result.model";
import {FormModel} from "../../../../models/form/form.model";
import {ChartModel} from "../../../../models/result/chart.model";
import {FormUtil} from "../../../../util/form.util";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Location} from "@angular/common";
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-form-stat',
    templateUrl: './form-stat.component.html',
    styleUrls: ['./form-stat.component.scss']
})
export class FormStatComponent implements OnInit {
    formData: FormResultModel;
    formModel: FormModel;
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
                            this.chartModels = FormUtil.toChartModels(
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
