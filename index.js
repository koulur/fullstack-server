require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')


app.use(cors())

let notes = [
    { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      },
      { 
        "name": "Joe Moe", 
        "number": "00-23-6403111",
        "id": 5
      }
]
morgan.token('type', function (req, res) 
                { 
                  if(req.method==="POST") {
                  const obby = {name: req.body.name,
                                number: req.body.number}
                  return  JSON.stringify(obby)
                  }
                  return " "
                }
)

app.use(morgan('tiny'))
app.use(morgan(':type'))
app.use(bodyParser.json())
app.use(express.static('build'))

app.get('/', (req, res) => {
  console.log("MOI TÄÄLTÄ")
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({})
  .then(people => {
    res.json(people.map(person => person.toJSON()))
    people.map(person => console.log(person))
  })
  .catch((error) => {
    console.log(error.message)
  })
  // res.json(notes)
})

app.get('/info', (req, res) => {
    const conss = notes.length
    const date = new Date()
    res.send(`<p>Phonebook has info for ${conss} people</p>
              <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {

    Person.findById(request.params.id)
      .then(person => {
        response.json(person.toJSON())
      })
      .catch((error) => {
        console.log(error.message)
        response.status(404).end()
      })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {

    //Missing name, will accept " "
    if(!request.body.name) {
        response.status(400).json({error: "missing name"})
    }

    //Missing number, will accept " "
    if(!request.body.number) {
        response.status(400).json({error: "missing number"})
    }

    //If name exists already
    if(notes.find(person => person.name === request.body.name)) {
        response.status(404).json({error: "name must be unique"})
    }

    const person = new Person({
      name: request.body.name,
      number: request.body.number
    })

    person.save()
          .then(savedPerson => {
            response.json(savedPerson.toJSON())
          })
          .catch(error => console.log(error.message)
          )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})