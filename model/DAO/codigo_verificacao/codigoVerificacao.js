const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)


// Insere ou atualiza um código de verificação
const insertCodigoVerificacao = async function(codigo) {

    try {

        let sql = `insert into tbl_codigo_verificacao (
            id_usuario,
            finalidade,
            codigo_hash,
            data_expiracao,
            tentativas,
            novo_email
        ) values (
            ?,
            ?,
            ?,
            ?,
            0,
            ?
        )
        ON DUPLICATE KEY UPDATE
            codigo_hash = VALUES(codigo_hash),
            data_expiracao = VALUES(data_expiracao),
            tentativas = 0,
            novo_email = VALUES(novo_email),
            criado_em = CURRENT_TIMESTAMP`

        let result = await knexConection.raw(sql, [
            codigo.id_usuario,
            codigo.finalidade,
            codigo.codigo_hash,
            codigo.data_expiracao,
            codigo.novo_email ?? null
        ])

        return true

    } catch (error) {

        console.log(error)
        return false
    }
}


// Busca o código de um usuário pela finalidade
const selectCodigoVerificacao = async function(idUsuario, finalidade) {

    try {

        let sql = `select * from tbl_codigo_verificacao
        where id_usuario = ?
        and finalidade = ?`

        let result = await knexConection.raw(sql, [
            idUsuario,
            finalidade
        ])

        return result[0]

    } catch (error) {

        console.log(error)
        return false
    }
}


// Incrementa a quantidade de tentativas
const updateTentativasCodigo = async function(idUsuario, finalidade) {

    try {

        let sql = `update tbl_codigo_verificacao
        set tentativas = tentativas + 1
        where id_usuario = ?
        and finalidade = ?`

        let result = await knexConection.raw(sql, [
            idUsuario,
            finalidade
        ])

        return true

    } catch (error) {

        console.log(error)
        return false
    }
}


// Exclui o código de verificação
const deleteCodigoVerificacao = async function(idUsuario, finalidade) {

    try {

        let sql = `delete from tbl_codigo_verificacao
        where id_usuario = ?
        and finalidade = ?`

        let result = await knexConection.raw(sql, [
            idUsuario,
            finalidade
        ])

        return true

    } catch (error) {

        console.log(error)
        return false
    }
}


module.exports = {
    insertCodigoVerificacao,
    selectCodigoVerificacao,
    updateTentativasCodigo,
    deleteCodigoVerificacao
}
