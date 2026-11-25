const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)


// INSERT COMENTARIO
const insertComentario = async function(comentario){
    try {
        let sql = `INSERT INTO tbl_comentario (
            comentario,
            id_receita,
            id_usuario
        ) VALUES (
            ?,
            ?,
            ?
        );`

        let result = await knexConection.raw(sql, [
            comentario.comentario,
            comentario.id_receita,
            comentario.id_usuario
        ])

        if (result[0].affectedRows > 0) {
            return result[0].insertId
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}


// SELECT COMENTARIOS POR RECEITA
const selectComentariosPorReceita = async function(idReceita){
    try {
        let sql = `SELECT
            tbl_comentario.*,
            tbl_usuario.nome,
            tbl_usuario.username,
            tbl_usuario.foto_perfil
        FROM tbl_comentario

        INNER JOIN tbl_usuario
            ON tbl_comentario.id_usuario = tbl_usuario.id

        WHERE tbl_comentario.id_receita = ?

        ORDER BY tbl_comentario.id DESC;`

        let result = await knexConection.raw(sql, [idReceita])

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
// SELECT QUANTIDADE DE COMENTARIOS POR RECEITA
const selectQtdComentariosPorReceita = async function(idReceita){
    try {
        let sql = `SELECT COUNT(*) AS qtd_comentarios
                   FROM tbl_comentario
                   WHERE id_receita = ?`

        let result = await knexConection.raw(sql, [idReceita])

        if (Array.isArray(result)) {
            return result[0][0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}


// UPDATE COMENTARIO
const updateComentario = async function(comentario){
    try {
        let sql = `UPDATE tbl_comentario SET
            comentario = ?
        WHERE id = ?
        AND id_usuario = ?;`

        let result = await knexConection.raw(sql, [
            comentario.comentario,
            comentario.id,
            comentario.id_usuario
        ])

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


// DELETE COMENTARIO
const deleteComentario = async function(idComentario, idUsuario){
    try {
        let sql = `DELETE FROM tbl_comentario
        WHERE id = ?
        AND id_usuario = ?;`

        let result = await knexConection.raw(sql, [
            idComentario,
            idUsuario
        ])

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


module.exports = {
    insertComentario,
    selectComentariosPorReceita,
    updateComentario,
    deleteComentario,
    selectQtdComentariosPorReceita
}