const configMessages = require('../modulo/configMessages.js')

const receitaTagDAO = require('../../model/DAO/receita_tag/receita_tag.js')

const inserirNovaTagReceita = async function (tagReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(tagReceita)

        if (validar) {
            return validar
        } else {
            let result = await receitaTagDAO.insertReceitaTag(tagReceita)
            if (result) {
                tagReceita.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = tagReceita

                return customMessage.DEFAULT_MESSAGE //201
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }
    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const buscarTagsIdReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
        if (idReceita == undefined || String(idReceita).replaceAll(' ', '') == '' || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST //400
        } else {
            let result = await receitaTagDAO.selectTagByIdReceita(idReceita)
            console.log(result)

                if (result) {

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.tag = result

                return customMessage.DEFAULT_MESSAGE
                                    
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirTagsIdReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {

        //Chamar a função do DAO para excluir o genero
        let result = await receitaTagDAO.excluirTagsIdReceita(idReceita)
        console.log(result)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }


    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDados = async function (receitaTag) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    if (receitaTag.id_receita == undefined || receitaTag.id_receita == '' || receitaTag.id_receita == null || receitaTag.id_receita <= 0 || isNaN(receitaTag.id_receita)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receitaTag.id_tag == undefined || receitaTag.id_tag == '' || receitaTag.id_tag == null || receitaTag.id_tag <= 0 || isNaN(receitaTag.id_tag)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

module.exports = {
    inserirNovaTagReceita,
    buscarTagsIdReceita,
    excluirTagsIdReceita

}