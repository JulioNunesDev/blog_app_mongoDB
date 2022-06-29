const express = require('express')
const handlebars = require('express-handlebars')
const bosyParser = require('body-parser')
const Port = 8081
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const { default: mongoose } = require('mongoose')
const Postagem = require('./models/Postagem')
const Categoria = require('./models/Categoria')
const passport = require('passport')
require('./config/auth')(passport)


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
app.use(passport.initialize())
app.use(passport.session())
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
app.use('/usuarios', usuarios)
    //outros

     
    app.get('/postagem/:slug', (req, res)=>{ 
        Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Esta postagem nao existe')
                res.redirect('/')
            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    })

app.get('/', (req, res)=>{
    Postagem.find().populate('categoria').sort({data: 'desc'}).then((postagens)=>{

        res.render('index', {postagens: postagens})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno' )
        res.redirect('/404')
    })
}) 

app.get('/categorias', (req, res)=>{ 
    Categoria.find().then((categorias)=>{
        res.render('categorias/index', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno ao listar as categorias' )
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).then((categoria)=>{

        if(categoria){
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro ao listar os posts!')
                console.log(err);
                res.redirect('/')
            })


        }else{
            req.flash('error_msg', 'Esta categoria nao existe')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
        res.redirect('/')
    })
})

app.get('/404', (req, res)=>{ 
    res.send('404')
})

app.listen(Port, () => {
    console.log("Rodando na Porta: ", Port);
})