//Import da biblioteca para manipular dados no Banco de dados MySQL
const knex = require('knex')

//import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

const insertUsuario = async function (usuario) {
    try {
        let sql = `INSERT INTO tbl_usuario (
            nome,
            username,
            email,
            senha,
            data_nascimento
        ) VALUES (
            '${usuario.nome}',
            '${usuario.username}',
            '${usuario.email}',
            '${usuario.senha}',
            '${usuario.data_nascimento}'
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

const selectUsuarioByEmail = async function (email) {
    try {
        let sql = `SELECT id, email, senha
                   FROM tbl_usuario
                   WHERE email = '${email}'`

        let result = await knexConection.raw(sql)

        if (result[0].length > 0) {
            return result[0][0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateUsuario = async function (usuario) {
    try {
        let sql = `UPDATE tbl_usuario SET
        nome = '${usuario.nome}',
        username = '${usuario.username}',
        email = '${usuario.email}',
        descricao = '${usuario.descricao}',
        banner_url = '${usuario.banner_url}',
        foto_perfil = '${usuario.foto_perfil}',
        data_nascimento = '${usuario.data_nascimento}'
    WHERE id = ${id};`

        let result = await knexConection.raw(sql)
        if (result)
            return true

        else
            return false


    } catch (error) {
        return false
    }
}

const selectUsuarioById = async function (id) {
    try {

        let sql = `
            SELECT
                id,
                nome,
                username,
                email,
                descricao,
                banner_url,
                foto_perfil,
                data_nascimento
            FROM tbl_usuario
            WHERE id = ${id}
        `

        let result = await knexConection.raw(sql)

        if (result[0].length > 0) {
            return result[0][0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}



module.exports = {
    insertUsuario,
    selectUsuarioByEmail,
    updateUsuario,
    selectUsuarioById
}