import {AnswerBase} from './answer-base';
export class AnswerSlider extends AnswerBase<number> {
    type = 'slider';

    constructor(input: any) {
        super(input);
    }
}