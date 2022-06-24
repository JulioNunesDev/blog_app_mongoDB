const express = require('express')
const router = express.Router()

const Categoria = require('../models/Categoria')


router.get('/', (req, res) => {
    res.render('admin/index')
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


router.get("/categorias/edit/:id", (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria})
    })
    .catch(()=>{
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res)=>{
    let id = req.body.id
        Categoria.findOne({_id: id}).then((categoria)=>{
            categoria.nome =  req.body.nome,
            categoria.slug = req.body.slug


            categoria.save().then(()=>{
                req.flash('success_msg', 'Categoria editada com sucesso!')
                 res.redirect('/admin/categorias')
            })
            .catch((err)=>{
                req.flash('error_msg', 'Houve um erro interno ao editar a categoria')
                res.redirect('/admin/categorias')
            })
        }).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
        })
})

router.post('/categorias/edit/:id', (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar categoria!')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', (req, res) => {
    res.render('admin/postagens')
})

router.get('/postagens/add', (req, res) => {
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário.')
        res.redirect('/admin')
    })
})


module.exports = router;