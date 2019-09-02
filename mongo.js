const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

if (process.argv.length < 3){
    console.log('Give password as an argument.')
    process.exit(1)
}
const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-simwd.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 1,
        required: true
    },
    number: {
        type: String,
        minlength: 5,
        required: true
    },
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length==3) {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length==5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log('Successfully saved: \n', response)
        mongoose.connection.close()
    })
}
