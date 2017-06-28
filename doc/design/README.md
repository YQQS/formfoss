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
    "formItems": [
        {
            "id": 1,
            "title": "item title",
            "desc": "item description",
            "type": "string",
            "validator": {
                "min": 2,
                "max": 20,
                "required": true
            }
        },
        {
            "id": 2,
            "title": "another item title",
            "desc": "another item description",
            "type": "number",
            "validator": {
                "min": 2,
                "max": 20,
                "required": false
            }
        },
        {
            "id": 3,
            "title": "yet another title",
            "desc": "yet another descript",
            "type": "multiChoice",
            "validator": {
                "required": true
            }
        }
    ]
}
```
### description
- id: the unique id for the form
  + type: number

- title: form title
  + type: string

- desc: form's description

- settings: some settings setted by the user
  + isPrivate:
  + shareResult: whether to share the result to the anwsered user
      - type: boolean
      - default: false
  + shuffleOrder: whether to shuffle the order the form item
      - type: boolean
      - default: false

- formItems: structure of each form item, it is a array of formItem
for each formItem:
  + id: unique id of each formItem in the form
      - type: number
  + title: the title of the formItem
    - type: string
  + desc: description of the formItem
    - type: string
  + type: what input type should the user input
    - type: string
    - valid type: "string" | "number" | "Time" | "Date" | "multiChoice" | "singleChoice"
  + validator: valid of the input data



## formData
this json object represent the reuslt of a form that the owner can see
e.g:
```json
{
    "id": 1,
    "answerCount": 40,
    "data": [
        {
            "id": 1,
            "type": "string",
            "result": ["ace","jack","mac","linus"]
        },
        {
            "id": 2,
            "type": "number",
            "result": [1,2,3]
        },
        {
            "id": 3,
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
- id: the id match corresponding formObject
  + type: number
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
    "id": 1,
    "answers": [
        {
            "id": 1,
            "type": "string",
            "answer": "ace"
        },
        {
            "id": 2,
            "type": "number",
            "answer": 2
        },
        {
            "id": 3,
            "type": "multiChoice",
            "answer": "choice1"
        }
    ]
}
```
### description
+ id: the corresponding form 
    - type: number
+ answers: answers user input for a corresponding form
    - id: the form item id
        + type: number
    - type: the input type
        + type: string
        + valid type: "string" | "number" | "Time" | "Date" | "multiChoice" | "singleChoice"
        
    - answer: the answer user input
        + type: the type above


