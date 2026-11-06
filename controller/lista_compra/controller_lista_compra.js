const configMessages = require('../modulo/configMessages.js')

const listaCompraDAO = require('../../model/DAO/lista_compra/lista_compra.js')

const controllerIngrediente = require('../ingrediente/controller_ingrediente.js')

const inserirListaCompra = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let validar = await validarDados(idUsuario,idReceita)

        if (validar) {
            return validar
        } else {

            let resultIngredientes = await controllerIngrediente.listarIngredientesPorReceita(idReceita)

            if (!resultIngredientes || !resultIngredientes.status) {
                return resultIngredientes
            }
            let ingredientes = resultIngredientes.response.ingrediente

            if (ingredientes.length === 0) {
                return customMessage.ERROR_NOT_FOUND
            }

            console.log(ingredientes)
            for (const ingrediente of ingredientes) {

                let dadosListaCompra = {
                    id_usuario: idUsuario,
                    id_ingrediente: ingrediente.id,
                    id_status: 2
                }
    
                let result = await listaCompraDAO.insertListaCompra(dadosListaCompra)
    
                if (result === false) {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }
    
            if (result) {
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                return customMessage.DEFAULT_MESSAGE
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const listarReceitasListaCompra = async function(idUsuario){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await listaCompraDAO.selectALLReceitasListaCompra(idUsuario)

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.receitas = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    }catch(error){
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarIngredientesListaCompraReceita = async function(idUsuario, idReceita, status){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await listaCompraDAO.selectIngredientesListaCompra(idUsuario, idReceita, status)

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.ingredientes = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
        }else{
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }
    }catch(error){
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarStatusListaCompra = async function(id, idUsuario, idStatus) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (validar) {
            return validar
        }

        let result = await listaCompraDAO.updateStatusListaCompra(id, idUsuario, idStatus)

        if (result) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATED_ITEM.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATED_ITEM.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATED_ITEM.message

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDados = async function (idUsuario, idReceita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (idUsuario == undefined || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    if (idReceita == undefined || idReceita == null || isNaN(idReceita) || idReceita <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID RECEITA] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }

    return false
}


module.exports = {
    inserirListaCompra,
    listarIngredientesListaCompraReceita,
    listarReceitasListaCompra,
    atualizarStatusListaCompra
}

