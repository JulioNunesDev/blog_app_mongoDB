const express = require('express')
const handlebars = require('express-handlebars')
const bosyParser = require('body-parser')
const Port = 8081
const admin = require('./routes/admin')
const path = require('path')
const { default: mongoose } = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
    //const mongoose = require('mongoose')
const app = express()

//configurações
app.use(session({
    secret: 'cursodenode',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//middlewares!!
app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg')
        next()
    })
    //middlewares!!
    //configurações
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp').then(() => {
        console.log('Conectado ao Mongo')
    }).catch((err) => {
        console.log('Erro ao se conectar ao mongo', err);
    })
    //HandleBars
app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoMethodsByDefault: true,
            allowProtoPropertiesByDefault: true
        }
    }))
    // Views
app.set('view engine', 'handlebars')
    //Body Parser
app.use(bosyParser.urlencoded({ extended: false }))
app.use(bosyParser.json())
    // Public
app.use(express.static(path.join(__dirname, 'public')))

//rotas 
app.use('/admin', admin)
    //outros

app.listen(Port, () => {
    console.log("Rodando na Porta: ", Port);
})