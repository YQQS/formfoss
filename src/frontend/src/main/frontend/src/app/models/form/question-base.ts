import {QuestionValidator} from './question-validator';

export class QuestionBase<T> {
    value: T;
    key: string;
    title: string;
    desc?: string;
    order: number;
    controlType: string;
    inputType?: string;
    validator?: QuestionValidator;

    constructor(options: {
        value?: T,
        key?: string,
        title?: string,
        desc?: string,
        order?: number,
        inputType?: string,
        controlType?: string,
        validator?: QuestionValidator,
    } = {}) {
        this.value = options.value || null;
        this.key = options.key || '';
        this.title = options.title || '';
        this.desc = options.desc || '';
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || '';
        this.inputType = options.inputType || '';
        this.validator = options.validator || {};
    }
}
