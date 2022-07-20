let erros = []

function Validators () {
    erros = []
}

Validators.prototype.isLenMin = (value, min, message) =>{
    if(!value || value.length < min){
        erros.push({message: message})
    }
}

Validators.prototype.erros = () =>{
    return erros
}

Validators.prototype.isValid = () =>{
    return erros.length === 0
}