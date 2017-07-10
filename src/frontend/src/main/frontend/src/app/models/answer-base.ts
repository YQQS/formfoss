export class AnswerBase<T> {
    id?: number;
    key?: string;
    answer: T;
    type: string;

    constructor(input: {
        id?: number,
        key?: string,
        answer?: T,
        type?: string
    } = {}) {
        this.id = input.id;
        this.key = input.key;
        this.answer = input.answer;
        this.type = input.type;
    }
}