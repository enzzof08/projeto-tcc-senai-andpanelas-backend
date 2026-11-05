const configMessages = require('../modulo/configMessages')

const denunciaUsuarioDAO = require('../../model/DAO/denuncia_usuario/denuncia_usurio')

const inserirDenunciaUsuario = async function (denunciaUsuario){
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{
        let validar = await validarDados(denunciaUsuario)

        if(validar){
            return validar
        }else{
            let result = await denunciaUsuarioDAO.insertDenunciaUsuario(denunciaUsuario)
            if(result){
                denunciaUsuario.id = result
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                customMessage.DEFAULT_MESSAGE.response = receitaCategoria

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_INTERNAL_MODEL
            }
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDenunciaByIdUsuario = async function (idUsuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
        if (idUsuario == undefined || String(idUsuario).replaceAll(' ', '') == '' || idUsuario == '' || idUsuario == null || isNaN(idUsuario) || idUsuario <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await denunciaUsuarioDAO.selectDenunciaByIdUsuario(idUsuario)
            if (result) {
                if (result === false) {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.usuario = result

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuarioByIdDenuncia = async function (idDenuncia) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    try {
        if (idDenuncia == undefined || String(idDenuncia).replaceAll(' ', '') == '' || idDenuncia == '' || idDenuncia == null || isNaN(idDenuncia) || idDenuncia <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_DENUNCIA] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST
        } else {
            let result = await denunciaUsuarioDAO.selectUsuarioByIdDenuncia(idUsuario)
            if (result) {
                if (result === false) {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.denuncia = result

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function (denunciaUsuario) {
    if (denunciaUsuario.id_usuario == undefined || denunciaUsuario.id_usuario == '' || denunciaUsuario.id_usuario == null || denunciaUsuario.id_usuario <= 0 || isNaN(denunciaUsuario.id_usuario)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (denunciaUsuario.id_denuncia == undefined || denunciaUsuario.id_denuncia == '' || denunciaUsuario.id_denuncia == null || denunciaUsuario.id_denuncia <= 0 || isNaN(denunciaUsuario.id_denuncia)) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_DENUNCIA] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

module.exports = {
    inserirDenunciaUsuario,
    buscarDenunciaByIdUsuario,
    buscarUsuarioByIdDenuncia
}