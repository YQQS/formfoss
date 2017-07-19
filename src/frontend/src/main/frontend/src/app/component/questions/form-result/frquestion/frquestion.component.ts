import {Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {ChartModel} from "../../../../models/result/chart.model";

@Component({
    selector: 'app-frquestion',
    templateUrl: './frquestion.component.html',
    styleUrls: ['./frquestion.component.scss']
})
export class FRQuestionComponent implements OnInit{
    @Input() chartModel: ChartModel;
    chartType: string[] = ['polarArea', 'pie', 'doughnut'];

    constructor() { }

    ngOnInit() {
    }

}
