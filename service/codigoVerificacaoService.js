const crypto = require('crypto')
const bcrypt = require('bcrypt')

// Gera um código aleatório de 6 números
const gerarCodigo = function() {

    return crypto.randomInt(100000, 1000000).toString()

}


// Gera o hash do código
const gerarHashCodigo = async function(codigo) {

    return await bcrypt.hash(codigo, 10)

}


// Compara o código digitado com o hash armazenado
const compararCodigo = async function(codigo, codigoHash) {

    return await bcrypt.compare(codigo, codigoHash)

}


// Gera a data de expiração do código (10 minutos)
const gerarDataExpiracao = function() {

    return new Date(Date.now() + 10 * 60 * 1000)

}


module.exports = {
    gerarCodigo,
    gerarHashCodigo,
    compararCodigo,
    gerarDataExpiracao
}
