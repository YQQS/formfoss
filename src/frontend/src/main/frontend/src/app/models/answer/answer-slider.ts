import {AnswerBase} from "./answer-base";
export class AnswerSlider extends AnswerBase<number> {
    type: string = 'slider';

    constructor(input: {}={}) {
        super(input);
    }
}