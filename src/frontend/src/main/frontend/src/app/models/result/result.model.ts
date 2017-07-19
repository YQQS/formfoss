import {ResultAnswerBase} from "./result.answer-base";

export class ResultModel {
    formId: number;
    answerCount: number;
    data: ResultAnswerBase[];

    constructor(input: {
        formId: number,
        answerCount: number,
        data: ResultAnswerBase[]
    } | any) {
        this.formId = input.formId ;
        this.answerCount = input.answerCount || 0;
        this.data = input.data || [];
    }
}