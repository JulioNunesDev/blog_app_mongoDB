const express = require('express')
const router = express.Router()
const Categoria = require('../models/Categoria')
const Postagem = require('../models/Postagem')
const {eAdmin} = require('../helpers/eAdmin')



router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categorias', { categorias: categorias, styles: 'index.css'})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias!')
        res.redirect('/admin')
    })
})

router.post('/categorias/nova', eAdmin, (req, res) => {
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
    router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias', {styles: 'index.css'})
})


router.get("/categorias/edit/:id", eAdmin, (req, res)=>{
    Categoria.findOne({_id: req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', {categoria: categoria, styles: 'index.css'})
    })
    .catch(()=>{
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', eAdmin, (req, res)=>{
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

router.post('/categorias/edit/:id', eAdmin, (req, res)=>{
    Categoria.deleteOne({_id: req.body.id}).then(()=>{
        req.flash('success_msg', 'categoria deletada com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao deletar categoria!')
        res.redirect('/admin/categorias')
    })
})




router.get('/postagens', eAdmin, (req, res) => {

    Postagem.find().lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render('admin/postagens', {postagens: postagens, styles: 'index.css'})
    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulario')
        res.render('/admin/postagens')
    })
})


router.post('/postagensInput', eAdmin, (req, res) => {
    let dadosInput = req.body.livroID
    console.log(dadosInput)

    if(!dadosInput || typeof req.body.livroID == undefined || req.body.livroID == null) {
        req.flash('error_msg', 'Nao pode ser um campo vazio!')
        res.redirect('/admin/postagens')
    }
    
    Postagem.find({titulo: dadosInput}).lean().populate("categoria").sort({data:"desc"}).then((postagens)=>{
        res.render('admin/postagens_v1', {postagens: postagens, styles: 'index.css'})
    })
    .catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulario')
        res.render('/admin/postagens')
    })
   
})


router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().then((categorias)=>{
        res.render('admin/addpostagens', {categorias: categorias, styles: 'index.css'})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário.')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin, (req, res)=>{

    var erros = []
   

    if(req.body.categoria == '0'){
        erros.push({texto: "Catgoria inválida, registre uma categoria!"})
    }
    if(erros.length > 0){
        res.render('/admin/addpostagens', {erros: erros})
    }else{
            
          
          const postagem = new Postagem({
            NOME: req.body.nome,
            AUTOR: req.body.autor,
            DESCRICAO: req.body.descricao,
            CONTEUDO: req.body.conteudo,
            VOL: req.body.vol,
            ED: req.body.ed,
            ANO: req.body.ano,
            EDITORA: req.body.editora,
            ORIGEM: req.body.origem,
            LOCALIZACAO: req.body.localizacao,
            EXEMPLARES: req.body.exemplares,
            DATA: req.body.data,
            categoria: req.body.categoria
       })
          postagem.save().then(()=>{
                    req.flash('success_msg', 'Postagem criada com sucesso')
                    res.redirect('/admin/postagens')
                }).catch((err)=>{
                    console.log(err);
                    req.flash('error_msg', 'Houve um erro duarante o salvamento da postagem')
                    res.redirect('/admin/postagens')
                })

    }
})


router.get('/postagens/edit/:id', eAdmin, (req, res)=>{

    Postagem.findOne({_id: req.params.id}).then((postagem)=>{

        Categoria.find().then((categorias)=>{
            res.render('admin/editpostagens',{ categorias: categorias, postagem: postagem, styles: 'index.css'})
        }).catch(()=>{
            req.flash('error_msg', 'Houve um erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao carregar o formulário de edição')
        res.redirect('/admin/postagens')
    })

})

router.post('/postagem/edit', eAdmin, (req, res)=>{
    Postagem.findOne({_id: req.body.id}).then((postagem)=>{

        postagem.titulo = req.body.titulo
        postagem.autor = req.body.autor
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(()=>{
            req.flash('success_msg', 'Postagem editada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro interno')
            res.redirect('/admin/postagens')
        })

    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao salvar a edição')
        res.redirect('/admin/postagens')
    })
})

router.get('/postagens/deletar/:id', eAdmin, (req, res)=>{
    Postagem.deleteOne({_id: req.params.id}).then(()=>{
        req.flash('success_msg', 'Postagem deletada com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        req.flash('error_msg', 'houve um erro ao deletar postagem, tente novamente!')
        res.redirect('/admin/postagens')
    })
})


module.exports = router;