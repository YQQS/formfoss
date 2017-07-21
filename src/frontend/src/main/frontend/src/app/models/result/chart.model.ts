export class ChartModel {
    title: string;
    type: string;
    label: string[];
    data: number[];
    dataSets: {data: number[], label: string}[];
    options: any;

    constructor() {}
}