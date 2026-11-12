const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertSeguidor = async function(idSeguindo, idSeguidor){
    try {
        let sql = `INSERT INTO tbl_seguindo_seguidor (
            id_seguindo,
            id_seguidor
        ) VALUES (
            ?,
            ?
        );`

        let result = await knexConection.raw(sql, [idSeguindo, idSeguidor])

        if (result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.log(error)

        if (error.code === 'ER_DUP_ENTRY') {
            return 'DUPLICADO'
        }

        return false
    }
}

const deleteSeguidor = async function(idSeguindo, idSeguidor){
    try {
        let sql = `DELETE FROM tbl_seguindo_seguidor
        WHERE id_seguindo = ?
        AND id_seguidor = ?;`

        let result = await knexConection.raw(sql, [idSeguindo, idSeguidor])

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

const selectSeguidores = async function(idUsuario){
    try {
        let sql = `SELECT
            u.id,
            u.nome,
            u.username,
            u.foto_perfil
        FROM tbl_seguindo_seguidor AS s
        INNER JOIN tbl_usuario AS u
            ON u.id = s.id_seguidor
        WHERE s.id_seguindo = ?;`

        let result = await knexConection.raw(sql, [idUsuario])

        if (result)
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectSeguindo = async function(idUsuario){
    try {
        let sql = `SELECT
            u.id,
            u.nome,
            u.username,
            u.foto_perfil
        FROM tbl_seguindo_seguidor AS s
        INNER JOIN tbl_usuario AS u
            ON u.id = s.id_seguindo
        WHERE s.id_seguidor = ?;`

        let result = await knexConection.raw(sql, [idUsuario])

        if (result)
            return result[0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectVerificarSeguindo = async function(idSeguindo, idSeguidor){
    try {
        let sql = `SELECT id
        FROM tbl_seguindo_seguidor
        WHERE id_seguindo = ?
        AND id_seguidor = ?;`

        let result = await knexConection.raw(sql, [idSeguindo, idSeguidor])

        if (result)
            return result[0].length > 0
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports ={
    insertSeguidor,
    selectSeguidores,
    selectSeguindo,
    deleteSeguidor,
    selectVerificarSeguindo
}