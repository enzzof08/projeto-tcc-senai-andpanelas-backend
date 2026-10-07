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

module.exports = {
    insertUsuario
}