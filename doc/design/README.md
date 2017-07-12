# JSON Object reference
**we use json object to represent the structure of form, the result of the form, and the answer of a form per user**
___
# Syntax
## formObject
this object represent the structure of a form, the front page generate the corresponding form page based on the json object

e.g:
```json
{
    "id": 1,
    "title": "form title",
    "desc": "form description",
    "settings": {
        "isPrivate": false,
        "shareResult": true,
        "shuffleOrder": false
    },
    "questions": [
        {
            "key": "keyname",
            "title": "item title",
            "desc": "item description",
            "controlType": "textbox",
            "inputType": "text",
            "order": 1,
            "validator": {
                "min": 2,
                "max": 20,
                "required": true,
                "type": "email"
            }
        },
        {
            "key": "score",
            "title": "another item title",
            "desc": "another item description",
            "controlType": "slider",
            "order": 2,
            "validator": {
                "min": 2,
                "max": 20,
                "required": false
            }
        },
        {
            "key": "select",
            "title": "yet another title",
            "desc": "yet another descript",
            "controlType": "dropdown",
            "order": 3,
            "validator": {
                "required": true
            }
        }
    ]
}
```
### description

- key: the key name maped by Angular FormGroup, should be unique
    + type: string

- title: form title
  + type: string

- desc: form's description
    + type: string

- settings: some settings setted by the user
  + isPrivate:
  + shareResult: whether to share the result to the anwsered user
      - type: boolean
      - default: false
  + shuffleOrder: whether to shuffle the order the form item
      - type: boolean
      - default: false

- questions: structure of each form item, it is a array of formItem
for each formItem:
  + id: unique id of each formItem in the form
      - type: number
  + title: the title of the formItem
      - type: string
  + desc: description of the formItem
      - type: string

  + controlType: the type front page should render into
     - type: string
     - valid : 'textbox' | 'dropdown' | 'slider'
     - required

  + inputType: the type user should input (mainly for type = 'textbox')
     - type: string
     - valid: 'password' | 'email' | 'text'

  + order: the formItem order front page should display
      - type: number


  + validator: valid of the input data
      - required: the questioin of the formItem should  not be empty

      - type = 'slider' has another extra options:
         + min: min value
         + max: max value

      - type = 'textbox' has another extra options
         + minLength: min length of the input string
         + maxLength: max length of the input string
         + type: input string type validator, current only type = 'email' is supported
         + pattern: input string must match the pattern

      - any other options don't match will be ignored


## formData
this json object represent the reuslt of a form that the owner can see
e.g:
```json
{
    "id": 1,
    "answerCount": 40,
    "data": [
        {
            "key": "question1",
            "type": "string",
            "result": ["ace","jack","mac","linus"]
        },
        {
            "key": "question2",
            "type": "number",
            "result": [1,2,3]
        },
        {
            "key":"question3",
            "type": "multiChoice",
            "result": [
                {
                    "choiceName":"choice1",
                    "choiceCount":2
                },
                {
                    "choiceName":"choice2",
                    "choiceCount":3
                }
            ]
        }
    ]
}
```
### description
- key: the unique key match corresponding formObject
  + type: string
- answerCount: how many times the form has been answered
  + type: number
  + default: 0

- data: the form result of the form, it is a array of data item
for each data item, it represent the data for corresponding form
  + id: the form item id
    - type: string
  + type: the valid input type
    - type: string
    - valid type: "string" | "number" | "Date" | "Time" | "multiChoice" | "singleChoice"
  + result: the specified result, it is a array of multi answer
    - if the type above is number/string, the result is a array of number/string, each number represent a answer of a user
    - if the type above is string: the reuslt is a arary of string
    - if the type above is multiChoice or singleChoice, the result is array of the choiceObject, the choiceObject

## userAnswer
this json object represent answers for a specified form inputed by a specified user
e.g :
```json
{
    "answerId": 1,
    "user_id": 2,
    "answers": [
        {
            "key": "question1",
            "type": "string",
            "answer": "ace"
        },
        {
            "key": "question2",
            "type": "number",
            "answer": 2
        },
        {
            "key": "question3",
            "type": "multiChoice",
            "answer": ["choice1"]
        }
    ]
}
```
### description
+ answerId: the corresponding form
    - type: number
+ user_id: the corresponding user id to this userAnswer
    - type: number
+ answers: answers user input for a corresponding form
    - key: the form item key
        + type: string
    - type: the input type(controlType)
        + type: string
        + valid type: "string" | "number" | "Time" | "Date" | "multiChoice" | "singleChoice"

    - answer: the answer user input
        + type: the type above
