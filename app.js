const express = require('express')
const handlebars = require('express-handlebars')
const bosyParser = require('body-parser')
const admin = require('./routes/admin')
const Port = process.env.PORT || 8081
const usuarios = require('./routes/usuario')
const path = require('path')

const Postagem = require('./models/Postagem')
const Categoria = require('./models/Categoria')
const passport = require('passport')
require('./config/auth')(passport)
require('./config/db')


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
        res.locals.error = req.flash('error')
        res.locals.user = req.user || null
        next()
    })
    //middlewares!!
    //configurações

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

     
    app.get('/postagem/:autor', (req, res)=>{ 
        Postagem.findOne({autor: req.params.autor}).then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem, styles: 'index.css'})
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
        Categoria.find().then(cat =>{
            res.render('index', {postagens: postagens,
             cat: cat,
             styles: 'index.css',
             scripts: 'select.js'
            })
          
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno' )
        res.redirect('/404')
    })
}) 


app.post('/news', (req, res)=>{
    let text = req.body.test
    console.log(text)

    if(!text || typeof req.body.test == undefined || req.body.test == null) {
        req.flash('error_msg', 'Nao pode ser um campo vazio!')
        res.redirect('/')
    }


     
    Postagem.find({titulo: req.body.test}).populate('categoria').sort({data: 'desc'}).then((livros, postagens)=>{
        Categoria.find().then(cat =>{
        res.render('livros',
         {postagens: postagens,
          cat: cat,
          livros: livros,
          styles: 'index.css'
        })
    })
        
        // Categoria.find().then(cat =>{
            
          
        // })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno' )
        res.redirect('/404')
    })






    // Postagem.find({titulo: req.body.test}).then(livros=>{
    //     res.render('livros', {livros:livros})
    // })
})








app.get('/categorias', (req, res)=>{ 
    Categoria.find().then((cat)=>{
        res.render('categorias/index', {cat: cat, styles: 'index.css'})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno ao listar as categorias' )
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug: req.params.slug}).then((cat)=>{

        if(cat){
            Postagem.find({categoria: cat._id}).then((postagens)=>{
                res.render('categorias/postagens',
                 {postagens: postagens,
                 cat: cat,
                 styles: 'index.css'
                
                })
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