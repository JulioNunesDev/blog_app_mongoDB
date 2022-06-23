const express = require('express')
const router = express.Router()

const Categoria = require('../models/Categoria')


router.get('/', (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('pagima de posts')
})

router.get('/categorias', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categorias', { categorias: categorias })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        res.redirect('/admin')
    })
})

router.post('/categorias/nova', (req, res) => {
    const nome = req.body.nome;
    const slug = req.body.slug;
    const erros = []
    if (!nome || typeof nome == undefined || nome == null) {
        erros.push({ texto: "Nome Inválido!" })
    }
    if (!slug || typeof slug == undefined || slug == null) {
        erros.push({ texto: "Slug Inválido!" })
    }
    if (slug.length < 2) {
        erros.push({ texto: "Nome de slug muito pequeno!" })
    }
    if (erros.length > 0) {
        res.render('admin/addcategorias', { erros: erros })
    } else {
        try {
            const novaCategoria = new Categoria({ nome: nome, slug: slug })
            novaCategoria.save()
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        } catch (error) {
            req.flash('error_msg', 'Houve um erro ao criar categoria, tente novamente!')
            res.redirect('/admin')
        }
    }



})

router.get('/categorias/add', (req, res) => {
    res.render('admin/addcategorias')
})


module.exports = router;