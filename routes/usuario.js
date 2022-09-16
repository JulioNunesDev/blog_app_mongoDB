const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const controller = require('./controllers/usuario-controller')

router.get('/registro', controller.get)

router.post('/registro', (req, res)=>{
    var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: 'Email inválido'})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: 'Senha inválido'})
    }
    if(req.body.senha.length < 7){
        erros.push({texto: 'Senha muito curta'})
    }
    if(req.body.senha !== req.body.senha2){
        erros.push({texto: 'As senha são diferentes, tente novamente'})
    }

    if(erros.length > 0 ){
        res.render('usuarios/registro', {erros: erros})
    }else{

        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                req.flash('error_msg', 'Já existe uma conta com este e-mail no nosso sistema!')
                res.redirect('/usuarios/registro')
            }else{
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                })

                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash('error_msg', 'Houve um erro durante o salvamento do usuário')
                            res.redirect('/')
                        }

                        novoUsuario.senha = hash
                        novoUsuario.save().then(()=>{
                        req.flash('success_msg', 'Usuário criado com sucesso!')
                        res.redirect('/')
                    }).catch((err)=>{
                        req.flash('error_msg', 'Houve um erro ao criar o Usuário, tente novamente!')
                        res.redirect('/usuarios/registro')

                        })

                    })
                })


            }
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect('/')
        })
    }

})

router.get('/login', (req, res)=>{
    res.render('usuarios/login', {
        styles: 'index.css'
    })
})

router.post('/login', (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res, next)=>{
    req.logout((err)=>{
        req.flash('success_msg', 'Deslogado com sucesso!')
        res.redirect('/')
    })
})






module.exports = router