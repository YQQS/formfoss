import {QuestionBase} from './question-base';

export class QuestionSlider extends QuestionBase<number> {
    controlType = 'slider';
    constructor(input: {} = {}) {
        super(input);
    }
}