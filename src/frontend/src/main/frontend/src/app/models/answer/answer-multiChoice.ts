import {AnswerBase} from './answer-base';
export class AnswerMultiChoice extends AnswerBase<string[]> {
    type = 'multiChoice';

    /*
     * string to describe other optional answer for the question
     */
    other?: string;

    constructor(input: any) {
        super(input);
        this.other = input['other'] || null;
    }
}