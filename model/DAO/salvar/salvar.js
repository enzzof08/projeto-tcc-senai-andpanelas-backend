const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertSalvoReceita = async function (idUsuario, idReceita) {
    try {
        let sql = `insert into tbl_salvo (
            id_usuario,
            id_receita
        ) values (
            ${idUsuario},
            ${idReceita}
        );`

        //Encaminha para o BD o scriptSQL
        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId //Retorna o ID gerado no insert
        else
            return false

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return 'DUPLICADO'
        }

        console.log(error)
        throw error
    }
}

const deleteSalvoReceita = async function (idUsuario, idReceita) {
    try {
        let sql = `DELETE FROM tbl_salvo
        WHERE id_usuario = ${idUsuario}
        AND id_receita = ${idReceita};`

        let result = await knexConection.raw(sql)

        if (result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectSalvosReceita = async function (idReceita) {
    try {
        let sql = `SELECT
            COUNT(id) AS qtd_salvo
        FROM tbl_salvo
        WHERE id_receita = ${idReceita};`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0][0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectSalvoUsuario = async function (idUsuario, idReceita) {
    try {
        let sql = `SELECT id
        FROM tbl_salvo
        WHERE id_usuario = ${idUsuario}
        AND id_receita = ${idReceita};`

        let result = await knexConection.raw(sql)

        if (result)
            if (result[0].length > 0) {
                return true
            } else {
                return false
            }
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertSalvoReceita,
    deleteSalvoReceita,
    selectSalvoUsuario,
    selectSalvosReceita
}