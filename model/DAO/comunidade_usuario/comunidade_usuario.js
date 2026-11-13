const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidadeUsuario = async function (idUser, idComunidade) {
    try {
        let sql = `INSERT INTO tbl_comunidade_usuario (
            id_comunidade,
            id_usuario
        ) VALUES (?, ?);`

        let result = await knexConection.raw(sql, [idComunidade, idUser])

        if (result[0].affectedRows > 0) {
            return result[0].insertId
        } else {
            return false
        }

    } catch (error) {
        console.log(error)

        if (error.code === 'ER_DUP_ENTRY') {
            return 'DUPLICADO'
        }
        
        return false
    }
}

const selectComunidadeByIdUsuario = async function(idUsuario){
    try {
        let sql = `
            SELECT
                tbl_comunidade.*,
                tbl_categoria_principal.categoria_principal
            FROM tbl_comunidade_usuario
                INNER JOIN tbl_comunidade
                    ON tbl_comunidade.id = tbl_comunidade_usuario.id_comunidade
                LEFT JOIN tbl_categoria_principal
                    ON tbl_categoria_principal.id = tbl_comunidade.id_categoria_principal
            WHERE tbl_comunidade_usuario.id_usuario = ?;
        `

        let result = await knexConection.raw(sql, [idUsuario])

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

const selectUsuarioByIdComunidade = async function(idComunidade){
    try {
        let sql = `
    SELECT tbl_usuario.*
    FROM tbl_comunidade
        INNER JOIN tbl_comunidade_usuario
            ON tbl_comunidade.id = tbl_comunidade_usuario.id_comunidade
        INNER JOIN tbl_usuario
            ON tbl_usuario.id = tbl_comunidade_usuario.id_usuario
    WHERE tbl_comunidade_usuario.id_comunidade = ?
    ORDER BY tbl_comunidade_usuario.id ASC;
`

        let result = await knexConection.raw(sql, [idComunidade])

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

const deleteComunidadeUsuario = async function(idUsuario, idComunidade){
    try {
        let sql = `DELETE FROM tbl_comunidade_usuario
        WHERE id_usuario = ?
        AND id_comunidade = ?;`

        let result = await knexConection.raw(sql, [idUsuario, idComunidade])

        if (result[0].affectedRows > 0) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectVerificarComunidadeUsuario = async function(idUsuario, idComunidade){
    try {
        let sql = `SELECT id
        FROM tbl_comunidade_usuario
        WHERE id_usuario = ?
        AND id_comunidade = ?;`

        let result = await knexConection.raw(sql, [idUsuario, idComunidade])

        if (Array.isArray(result)) {
            return result[0].length > 0
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertComunidadeUsuario,
    selectComunidadeByIdUsuario,
    selectUsuarioByIdComunidade,
    deleteComunidadeUsuario,
    selectVerificarComunidadeUsuario
}