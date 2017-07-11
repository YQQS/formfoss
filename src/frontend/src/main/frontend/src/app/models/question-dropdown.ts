import {QuestionBase} from "./question-base";

export class QuestionDropDown extends QuestionBase<string> {
    controlType = 'dropdown';
    multiple: boolean;
    options: {key: string, value: string}[] = [];

    constructor(input: {} = {}) {
        super(input);
        this.multiple = input['multiple'] || false;
        this.options = input['options'] || [];
    }
}