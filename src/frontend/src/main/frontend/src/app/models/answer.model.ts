import {AnswerBase} from "./answer-base";
export class AnswerModel {
    answerId?: number;
    formId: number;
    userId?: number;
    answers: AnswerBase<any>[];

    constructor(input: {
        formId: number,
        userId?: number,
        answerId?: number,
        answers?: AnswerBase<any>[]
    }) {
        this.formId = input.formId;
        this.userId = input.userId || null;
        this.answerId = input.answerId || null;
        this.answers = input.answers || [];
    }
}