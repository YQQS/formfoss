import {QuestionBase} from './question-base';

export class QuestionDropDown extends QuestionBase<string | string[]> {
    controlType = 'dropdown';
    multiple: boolean ;
    options: {key: string, value: string}[];

    constructor(input: {} = {}) {
        super(input);
        this.options = input['options'] || [];
        this.multiple = input['multiple'] || false;
    }
}
