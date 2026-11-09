const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)


const insertListaCompra = async function (listaCompra) {
    try {
        let sql = `insert into tbl_lista_compra (
            id_ingrediente,
            id_status,
            id_usuario
        ) values (
            '${listaCompra.id_ingrediente}',
            '${listaCompra.id_status}',
            ${listaCompra.id_usuario}
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
        return false
    }
}

const selectALLReceitasListaCompra = async function (idUsuario) {
    try {
        let sql = `SELECT DISTINCT
  tbl_receita.id,
    tbl_receita.titulo,
    tbl_receita.foto
FROM tbl_lista_compra

INNER JOIN tbl_ingrediente
    ON tbl_lista_compra.id_ingrediente = tbl_ingrediente.id

INNER JOIN tbl_receita
    ON tbl_ingrediente.id_receita = tbl_receita.id

WHERE tbl_lista_compra.id_usuario = ${idUsuario};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectIngredientesListaCompra = async function (idUsuario, idReceita, status) {
    try {
        let sql = `SELECT
            tbl_lista_compra.id,
            tbl_ingrediente.id AS id_ingrediente,
            tbl_ingrediente.nome,
            tbl_ingrediente.quantidade,
            tbl_lista_compra.id_status,
            tbl_status.status
        FROM tbl_lista_compra

        INNER JOIN tbl_ingrediente
            ON tbl_lista_compra.id_ingrediente = tbl_ingrediente.id

        INNER JOIN tbl_status
            ON tbl_lista_compra.id_status = tbl_status.id

        WHERE tbl_lista_compra.id_usuario = ${idUsuario}
        AND tbl_ingrediente.id_receita = ${idReceita}`

        if (status != undefined && status != null) {
            sql += ` AND tbl_lista_compra.id_status = ${status}`
        }

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const deleteListaCompraReceita = async function (idUsuario, idReceita) {
    try {
        let sql = `DELETE tbl_lista_compra
                   FROM tbl_lista_compra
                   INNER JOIN tbl_ingrediente
                       ON tbl_lista_compra.id_ingrediente = tbl_ingrediente.id
                   WHERE tbl_lista_compra.id_usuario = ${idUsuario}
                   AND tbl_ingrediente.id_receita = ${idReceita};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateStatusListaCompra = async function (id, idUsuario, idStatus) {
    try {
        let sql = `UPDATE tbl_lista_compra SET
            id_status = ${idStatus}
            WHERE id = ${id}
            AND id_usuario = ${idUsuario};`

        let result = await knexConection.raw(sql)

        if (result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

module.exports = {
    insertListaCompra,
    selectALLReceitasListaCompra,
    selectIngredientesListaCompra,
    deleteListaCompraReceita,
    updateStatusListaCompra
}

