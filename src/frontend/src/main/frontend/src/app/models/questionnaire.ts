export class Questionnaire {
    QuestionnaireId?: number;
    QuestionnaireName: string;
    CreateData: string;
    Account?: number;

    constructor(questionnaireId: number, questionnaireName: string, createData: string, account: number) {
        this.QuestionnaireId = questionnaireId;
        this.QuestionnaireName = questionnaireName;
        this.CreateData = createData;
        this.Account = account;
    }
}
