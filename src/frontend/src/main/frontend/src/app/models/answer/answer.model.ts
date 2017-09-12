import {AnswerBase} from './answer-base';
export class AnswerModel {
    formId: number;
    answerId?: number;
    userId?: number;
    commitflag?: boolean;
    answers: AnswerBase<any>[];

    constructor(input: any) {
        this.formId = input['formId'];
        this.userId = input['userId'] || null;
        this.answerId = input['answerId'] || null;
        this.commitflag = input['commitflag'] || false;
        this.answers = input['answers'] || [];
    }
}