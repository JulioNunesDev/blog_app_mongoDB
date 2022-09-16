const mongoose = require('mongoose')
const Schema =  mongoose.Schema

//
const Postagem = new Schema({
    NOME:{
        type: String,
        required: true
    },
    AUTOR:{
        type: String,
        required: true
    }, 
    DESCRICAO: {
        type: String,
        required: true
    },
    CONTEUDO:{
        type: String,
        required: true
    },
    VOL: {
        type: String,
        required: true
    },
    ED: {
        type: String,
        required: true
    },
    ANO:{
        type: String,
        required: true
    },
    EDITORA:{
        type: String,
        required: true
    },
    ORIGEM:{
        type: String,
        required: true
    },
    LOCALIZAÇÃO: {
        type: String,
        required: true
    },
    EXEMPLARES: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        required: true
        
    },
    DATA: {
        type: String,
        required: true
    },
    DATE: {
        type: Date,
        default: Date.now()
    }

})
module.exports = mongoose.model('postagens', Postagem)