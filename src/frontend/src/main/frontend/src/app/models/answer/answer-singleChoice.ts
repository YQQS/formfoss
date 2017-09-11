import {AnswerBase} from './answer-base';
export class AnswerSingleChoice extends AnswerBase<string> {
    type = 'singleChoice';

    /*
     * string to describe other optional answer for the question
     */
    other?: string;

    constructor(input: any) {
        super(input);
        this.other = input['other'] || null;
    }
}
