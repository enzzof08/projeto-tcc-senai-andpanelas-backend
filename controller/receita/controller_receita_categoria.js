const configMessages = require('../modulo/configMessages.js')

const receitaCtgnDAO = require('../../model/DAO/receita_categoria/receita_categoria.js')

const inserirNovaReceitaCategoria = async function (receitaCategoria) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let validar = await validarDados(receitaCategoria)

        if (validar) {
            return validar
        } else {
            let result = await receitaCtgnDAO.insertReceitaCategoria(receitaCategoria)
            if (result) {
                receitaCategoria.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = receitaCategoria

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


const buscarCategoriasIdReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
        if (idReceita == undefined || String(idReceita).replaceAll(' ', '') == '' || idReceita == '' || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_FILME] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST //400
        } else {
            let result = await receitaCtgnDAO.selectCategoriaByIdReceita(idReceita)
            if (result) {
                if (result === false) {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.categoria = result

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const excluirCategoriasIdReceita = async function (idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {

        //Chamar a função do DAO para excluir o genero
        let result = await receitaCtgnDAO.deleteCategoriasByIdReceita(idReceita)
        if (result) {
            return customMessage.SUCCESS_DELETED_ITEM
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }


    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}



const validarDados = async function (receitaCategoria) {
    if (receitaCategoria.id_receita == undefined || receitaCategoria.id_receita == '' || receitaCategoria.id_receita == null || receitaCategoria.id_receita <= 0 || isNaN(receitaCategoria.id_receita)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receitaCategoria.id_categoria == undefined || receitaCategoria.id_categoria == '' || receitaCategoria.id_categoria == null || receitaCategoria.id_categoria <= 0 || isNaN(receitaCategoria.id_categoria)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CATEGORIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}


module.exports = {
    inserirNovaReceitaCategoria,
    excluirCategoriasIdReceita,
    buscarCategoriasIdReceita
}
