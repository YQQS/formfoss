import {AnswerBase} from './answer-base';
export class AnswerModel {
    answerId?: number;
    formId: number;
    userId?: number;
    commitflag?: boolean;
    answers: AnswerBase<any>[];

    constructor(input: {
        formId: number,
        userId?: number,
        answerId?: number,
        flag?: boolean,
        answers?: AnswerBase<any>[]
    }) {
        this.formId = input.formId;
        this.userId = input.userId;
        this.answerId = input.answerId;
        this.commitflag = input.flag || false;
        this.answers = input.answers || [];
    }
}