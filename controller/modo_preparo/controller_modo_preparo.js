const configMessages = require('../modulo/configMessages.js')

const mdPreparoDAO = require('../../model/DAO/modo_preparo/modo_preparo.js')

const inserirModoPreparo = async function (mdPreparo) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(mdPreparo)

        if (validar) {
            return validar
        } else {

            let result = await mdPreparoDAO.insertModoPreparo(await tratarDados(mdPreparo))
            
            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = mdPreparo

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


const validarDados = async function (mdPreparo) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (mdPreparo.ordem_preparo == undefined || mdPreparo.ordem_preparo == '' || mdPreparo.ordem_preparo == null || isNaN(mdPreparo.ordem_preparo)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ORDEM PREPARO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (mdPreparo.metodo_preparo == undefined || mdPreparo.metodo_preparo == '' || mdPreparo.metodo_preparo == null || mdPreparo.metodo_preparo.length > 250) {
        customMessage.ERROR_BAD_REQUEST.field = '[METODO PREPARO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (mdPreparo.id_receita == undefined || mdPreparo.id_receita == '' || mdPreparo.id_receita == null || isNaN(mdPreparo.id_receita) || mdPreparo.id_receita <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}


//Função para tratar os dados a serem inseridos
const tratarDados = async function (mdPreparo) {
    mdPreparo.metodo_preparo = mdPreparo.metodo_preparo.replaceAll("'", "")

    return mdPreparo
}


module.exports = {
    inserirModoPreparo
}