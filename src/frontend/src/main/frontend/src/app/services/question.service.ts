import {Injectable} from "@angular/core";
import {QuestionBase} from "../questions/question-base";
import {QuestionDropDown} from "../questions/question-dropdown";
import {QuestionTextbox} from '../questions/question-textbox'
import {QuestionSlider} from "../questions/question-slider";

@Injectable()
export class QuestionService {
    getQuestions() {
        let questions: QuestionBase<any>[] = [
            new QuestionDropDown({
                key: 'brave',
                label: 'Bravery Rating',
                multiple: true,
                options: [
                    {key: 'solid', value: 'solid'},
                    {key: 'great', value: 'Great'},
                    {key: 'good', value: 'Good'},
                    {key: 'unproven', value: 'Unproven'}
                ],
                order: 3,
                validator: {
                    required: true
                }
            }),
            new QuestionTextbox({
                key: 'firstName',
                label: 'First name',
                value: 'Bombasto',
                inputType: 'text',
                order: 1,
                validator: {
                    required: true,
                    minLength: 3
                }
            }),
            new QuestionTextbox({
                key: 'emailAddress',
                label: 'Email',
                inputType: 'email',
                order: 2,
                validator: {
                    required: true,
                    type: 'email'
                }
            }),
            new QuestionTextbox({
                key: 'password',
                inputType: 'password',
                label: 'the password',
                type: 'password',
                order: 4,
                validator: {
                    required: true
                }
            }),
            new QuestionSlider({
                key: 'score',
                label: 'score',
                value: 55,
                order: 5,
                validator: {
                    min: 0,
                    max: 99,
                    required: true
                }
            })
        ];

        return questions.sort((a,b) => a.order - b.order);
    }
}
