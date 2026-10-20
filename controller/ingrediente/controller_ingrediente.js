const configMessages = require('../modulo/configMessages.js')

const ingredienteDAO = require('../../model/DAO/ingrediente/ingrediente.js')

const inserirIngrediente = async function (ingrediente) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(ingrediente)

        if (validar) {
            return validar
        } else {

            let result = await ingredienteDAO.insertIngrediente(await tratarDados(ingrediente))
            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = ingrediente

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const validarDados = async function (ingrediente) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (ingrediente.nome == undefined || ingrediente.nome == '' || ingrediente.nome == null || ingrediente.nome.length > 35) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (ingrediente.quantidade == undefined || ingrediente.quantidade == '' || isNaN(ingrediente.quantidade) || ingrediente.quantidade == null || ingrediente.quantidade.length > 10) {
        customMessage.ERROR_BAD_REQUEST.field = '[QUANTIDADE] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (ingrediente.id_receita || ingrediente.id_receita == '' || ingrediente.id_receita == null || isNaN(ingrediente.id_receita) || ingrediente.id_receita <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (fingrediente.id_unidade_medida == undefined || ingrediente.id_unidade_medida == '' || ingrediente.id_unidade_medida == null || isNaN(ingrediente.id_unidade_medida) || ingrediente.id_unidade_medida <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_UNIDADE_MEDIDA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else {
        return false
    }
}


//Função para tratar os dados a serem inseridos
const tratarDados = async function (ingrediente) {
    ingrediente.nome = ingrediente.nome.replaceAll("'", "")
    ingrediente.quantidade = ingrediente.quantidade.replaceAll("'", "")

    return ingrediente
}


module.exports = {
    inserirIngrediente
}