import { QuestionBase } from '../questions/question-base';
import { QuestionTextbox } from '../questions/question-textbox';
import { QuestionSlider } from '../questions/question-slider';
import { QuestionDropDown } from '../questions/question-dropdown';
import { QuestionValidator } from '../questions/question-validator';
import {DynamicFormModel}  from '../questions/dynamic-form.model';

export class QuestionBuilder {
    static buildQuestion(input: any): QuestionBase<any> {
        switch (input.controlType) {
            case 'textbox':
                return new QuestionTextbox(input);
            case 'dropdown':
                return new QuestionDropDown(input);
            case 'slider':
                return new QuestionSlider(input);
            default:
                return null;
        }
    }


    static buildDynamicForm(input: any): DynamicFormModel {
        let dyForm: DynamicFormModel = new DynamicFormModel();
        dyForm.title = input['title'] || '';
        dyForm.desc = input['desc'] || '';
        dyForm.settings = input['settings'] || {};
        dyForm.questions = input['questions']
              .map(question => QuestionBuilder.buildQuestion(question))
              .sort((a,b) => a.order - b.order);
        return dyForm;
    }

}
