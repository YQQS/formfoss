import {AnswerBase} from "./answer-base";
export class AnswerMultiChoice extends AnswerBase<String[]> {
    type: string = 'multiChoice';

    constructor(input: any) {
        super(input);
    }
}