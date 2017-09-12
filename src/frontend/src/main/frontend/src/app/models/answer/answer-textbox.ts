import {AnswerBase} from './answer-base';

export class AnswerTextbox extends AnswerBase<string> {
    type = 'textbox';

    constructor(input: any) {
        super(input);
    }
}
