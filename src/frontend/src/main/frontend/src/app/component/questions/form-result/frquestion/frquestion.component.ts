import {Component, OnInit, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {ChartModel} from "../../../../models/result/chart.model";
import {Chart} from 'chart.js';

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

    saveDiagram() {
        let ctx = <HTMLCanvasElement>document.getElementById('chart');
        let url_base64 = ctx.toDataURL('image/png');

        let downld = <HTMLLinkElement>document.getElementById('link');
        downld.href = url_base64;
    }

}
