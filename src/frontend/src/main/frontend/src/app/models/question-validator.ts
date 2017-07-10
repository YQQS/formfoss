export interface QuestionValidator {
    required?: boolean;
    // designed for text input
    min?: number;
    max?: number;
    pattern?: string;
    type?: string;

    // designed for number input
    minLength?: number;
    maxLength?: number;

}
