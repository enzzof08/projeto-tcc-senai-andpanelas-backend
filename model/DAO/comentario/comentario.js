const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComentario = async function (comentario){
    try{
        let sql = `INSERT INTO tbl_comentario (
            comentario,
            id_receita,
            id_usuario

        )values(
            '${chefinho_conversa.comentario}',
            '${chefinho_conversa.id_receita}',
            '${chefinho_conversa.id_usuario}'
        );`

        let result = await knexConection.raw(sql)

        if(result){
            return result[0].insertId
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const updateComentario = async function(comentario){
    try{
        let sql = `update tbl_comentario set
            comentario = '${comentario.comentario}',
            id_receita = '${comentario.id_receita}',
            id_usuario = '${comentario.id_usuario}'
        where id = ${comentario.id};`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false

    }catch (error){
        return false
    }
}

const selectComentarioByIdReceita = async function (idReceita) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (idReceita == undefined || idReceita == null || idReceita == '' || isNaN(idReceita) || !Number.isInteger(Number(idReceita)) || idReceita <= 0) {
            customMessage.ERROR_BAD_REQUEST.field = '[ID_RECEITA] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await comentarioDAO.selectComentariosPorReceita(idReceita)

        if (result) {
            if (result.length > 0) {

                for (let comentario of result) {
                    let resultUsuario = await controllerUsuario.buscarUsuario(comentario.id_usuario)

                    if (resultUsuario.status) {
                        comentario.usuario = resultUsuario.response.usuario
                        delete comentario.id_usuario
                    } else {
                        return resultUsuario
                    }
                }

                customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                customMessage.DEFAULT_MESSAGE.response.count = result.length
                customMessage.DEFAULT_MESSAGE.response.comentarios = result

                return customMessage.DEFAULT_MESSAGE

            } else {
                return customMessage.ERROR_NOT_FOUND
            }
        } else {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const deleteComentario = async function (idComentario){
    try{

        let sql = `delete from tbl_comentario where id = ${idComentario}`

        let result = await knexConection.raw(sql)

        if(result){
            return result[0]
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

module.exports ={
    insertComentario,
    updateComentario,
    selectComentarioByIdReceita,
    deleteComentario
}