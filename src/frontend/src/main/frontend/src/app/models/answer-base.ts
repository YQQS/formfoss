export class AnswerBase<T> {
    key?: string;
    answer: T;
    type: string;

    constructor(input: {
        key?: string,
        answer?: T,
        type?: string
    } = {}) {
        this.key = input.key;
        this.answer = input.answer;
        this.type = input.type;
    }
}