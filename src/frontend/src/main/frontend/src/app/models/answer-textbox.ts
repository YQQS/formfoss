import {AnswerBase} from "./answer-base";

export class AnswerTextbox extends AnswerBase<string> {
    type: string = 'textbox';

    constructor(input: {}={}) {
        super(input);
    }
}