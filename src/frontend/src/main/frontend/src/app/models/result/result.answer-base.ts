export class ResultAnswerBase {
    key: string;
    type: string;
    result: any[];

    constructor(input: {
        key: string,
        type: string,
        result: any[]
    }) {
        this.key = input.key;
        this.type = input.type;
        this.result = input.result;
    }
}