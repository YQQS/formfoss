import {AnswerBase} from "./answer-base";
export class AnswerSingleChoice extends AnswerBase<string> {
    type: string = 'singleChoice';

    constructor(input: any) {
        super(input);
    }
}
