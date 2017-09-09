/*
 * add this inside a QuestionBase class to activate dependency.
 */
export interface QuestionDependency {
    /* the key of the question that depends
     * depend question should only be controlType === 'dropdown'
     * once specified, that question must be answered to activate this dependency
     */
    key?: string;

    /*
     * a string or a list of string to indicate the required key of the options
     * should only work for controlType === 'dropdown', both single choice and multi choice
     */
    requiredOptions?: string | string[];
}
