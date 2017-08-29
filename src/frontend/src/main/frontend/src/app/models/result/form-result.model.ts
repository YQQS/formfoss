import {QuestionResultModel} from './question-result.model';

export class FormResultModel {
    formId: number;
    answerCount: number;
    data: QuestionResultModel[];

    constructor(input: {
        formId: number,
        answerCount: number,
        data: QuestionResultModel[]
    } | any) {
        this.formId = input.formId ;
        this.answerCount = input.answerCount || 0;
        this.data = input.data || [];
    }
}