const configMessages = require('../modulo/configMessages')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const denunciaDAO = require('../../model/DAO/denuncia/denuncia.js')

const controllerChefinho = require('../chefinho/controller_chefinho.js')

const inserirDenuncia = async function(denuncia, contentType){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

            let validar = await validarDados(denuncia)

            if(validar){
                return validar
            }else{

                let result = await denunciaDAO.insertDenuncia(denuncia)

                if(denuncia){
                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                    return customMessage.DEFAULT_MESSAGE
                }else{
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }

            }

        }else{
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    } 

}

const listarDenuncia = async function(){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try{

        let result = await denunciaDAO.selectAllDenuncia()

        if(result){

            if(result.length > 0){
                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.denuncia = result

                return customMessage.DEFAULT_MESSAGE
            }else{
                return customMessage.ERROR_NOT_FOUND
            }
            
        }

    } catch (error){
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const validarDados = async function(denuncia){

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if(denuncia.data == undefined || denuncia.data == ''|| denuncia.data == null || denuncia.data.length != 10){
        customMessage.ERROR_BAD_REQUEST.field = '[DATA] INVALIDA'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.motivo == undefined || denuncia.motivo == ''|| denuncia.motivo == null){
        customMessage.ERROR_BAD_REQUEST.field = '[MOTIVO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.detalhe || denuncia.detalhe == ''|| denuncia.detalhe == null){
        customMessage.ERROR_BAD_REQUEST.field = '[DETALHE] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if(denuncia.id_usuario == undefined || isNaN(denuncia.id_usuario) || denuncia.id_usuario.length > 5){
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVALIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else{
        return false
    }
}

const inserirDenunciaComunidade = async function (idComunidade, dados, contentType, idUsuarioDenunciante) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).split(';')[0].trim().toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        const idComunidadeNumerico = Number(idComunidade)
        const denuncia = montarDenuncia(dados, idUsuarioDenunciante)

        if (!Number.isInteger(idComunidadeNumerico) || idComunidadeNumerico <= 0 || !denuncia) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let comunidade = await denunciaDAO.selectComunidadeById(idComunidadeNumerico)

        if (!comunidade) {
            return customMessage.ERROR_NOT_FOUND
        }

        await denunciaDAO.insertDenunciaComunidade(idComunidadeNumerico, denuncia)

        let total = await denunciaDAO.selectTotalDenunciasComunidade(idComunidadeNumerico)

        let apagada = false

        if (total > 15) {
            await denunciaDAO.deleteComunidadeComDenuncias(idComunidadeNumerico)
            apagada = true
        } else if (total > 10) {
            let apagar = await controllerChefinho.avaliarComunidade(comunidade, denuncia.motivo, denuncia.detalhe)

            if (apagar === true) {
                await denunciaDAO.deleteComunidadeComDenuncias(idComunidadeNumerico)
                apagada = true
            }
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
        customMessage.DEFAULT_MESSAGE.response = { total_denuncias: total, comunidade_apagada: apagada }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const FOTO_BLOQUEADA = 'https://i.pinimg.com/originals/a9/c1/03/a9c10358112c550006d0db9b0f48d301.jpg'
const BANNER_BLOQUEADO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1PUaUb0c3ErJOjlNJd3XPKFynVrpxvjXw9uaHjKZEuA&s=10'

const montarDenuncia = function (dados, idUsuarioDenunciante) {
    const entrada = dados && typeof dados == 'object' ? dados : {}
    const motivo = typeof entrada.motivo == 'string' ? entrada.motivo.trim() : ''
    const detalhe = typeof entrada.detalhe == 'string' && entrada.detalhe.trim() != '' ? entrada.detalhe.trim() : null
    const idUsuarioNumerico = Number(idUsuarioDenunciante)

    if (motivo == '' || motivo.length > 50 || (detalhe && detalhe.length > 200) || !Number.isInteger(idUsuarioNumerico) || idUsuarioNumerico <= 0) {
        return null
    }

    return { motivo, detalhe, id_usuario: idUsuarioNumerico }
}

const inserirDenunciaReceita = async function (idReceita, dados, contentType, idUsuarioDenunciante) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).split(';')[0].trim().toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        const idReceitaNumerico = Number(idReceita)
        let denuncia = montarDenuncia(dados, idUsuarioDenunciante)

        if (!Number.isInteger(idReceitaNumerico) || idReceitaNumerico <= 0 || !denuncia) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let receita = await denunciaDAO.selectReceitaCompleta(idReceitaNumerico)

        if (!receita) {
            return customMessage.ERROR_NOT_FOUND
        }

        await denunciaDAO.insertDenunciaVinculada('tbl_denuncia_receita', 'id_receita', idReceitaNumerico, denuncia)

        let total = await denunciaDAO.selectTotalDenuncias('tbl_denuncia_receita', 'id_receita', idReceitaNumerico)

        let apagada = false

        if (total > 15) {
            apagada = true
        } else if (total > 10) {
            let apagar = await controllerChefinho.avaliarDenuncia('receita', { motivo: denuncia.motivo, detalhe: denuncia.detalhe, receita })
            apagada = apagar === true
        }

        if (apagada) {
            await denunciaDAO.deleteReceitaComDenuncias(idReceitaNumerico)
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
        customMessage.DEFAULT_MESSAGE.response = { total_denuncias: total, receita_apagada: apagada }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const inserirDenunciaUsuario = async function (idUsuarioDenunciado, dados, contentType, idUsuarioDenunciante) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).split(';')[0].trim().toUpperCase() != 'APPLICATION/JSON') {
            return customMessage.ERROR_CONTENT_TYPE
        }

        const idUsuarioDenunciadoNumerico = Number(idUsuarioDenunciado)
        let denuncia = montarDenuncia(dados, idUsuarioDenunciante)

        if (!Number.isInteger(idUsuarioDenunciadoNumerico) || idUsuarioDenunciadoNumerico <= 0 || !denuncia) {
            return customMessage.ERROR_BAD_REQUEST
        }

        let usuario = await denunciaDAO.selectUsuarioParaModeracao(idUsuarioDenunciadoNumerico)

        if (!usuario) {
            return customMessage.ERROR_NOT_FOUND
        }

        await denunciaDAO.insertDenunciaVinculada('tbl_denuncia_usuario', 'id_usuario', idUsuarioDenunciadoNumerico, denuncia)

        let total = await denunciaDAO.selectTotalDenuncias('tbl_denuncia_usuario', 'id_usuario', idUsuarioDenunciadoNumerico)

        let bloqueado = false

        if (total > 20) {
            bloqueado = true
        } else if (total > 15) {
            let apagar = await controllerChefinho.avaliarDenuncia('perfil', { motivo: denuncia.motivo, detalhe: denuncia.detalhe, dados_usuario: usuario })
            bloqueado = apagar === true
        }

        if (bloqueado) {
            await denunciaDAO.atualizarUsuario(idUsuarioDenunciadoNumerico, {
                email: `bloqueado${idUsuarioDenunciadoNumerico}@entrepanelas.invalid`,
                senha: await bcrypt.hash(crypto.randomUUID(), 10),
                foto_perfil: FOTO_BLOQUEADA,
                banner_url: BANNER_BLOQUEADO
            })
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
        customMessage.DEFAULT_MESSAGE.response = { total_denuncias: total, perfil_bloqueado: bloqueado }

        return customMessage.DEFAULT_MESSAGE
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirDenuncia,
    listarDenuncia,
    inserirDenunciaComunidade,
    inserirDenunciaReceita,
    inserirDenunciaUsuario
}