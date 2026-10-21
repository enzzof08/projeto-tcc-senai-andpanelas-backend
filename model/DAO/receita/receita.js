//Import da biblioteca para manipular dados no Banco de dados MySQL
const knex = require('knex')

//import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

const insertReceita = async function (receita) {
    const video = receita.video ?? ''
    try {
        let sql = `INSERT INTO tbl_receita (
            titulo,
            descricao,
            tempo,
            foto,
            video,
            id_custo,
            id_dificuldade,
            id_porcao,
            id_usuario
        
        ) VALUES (
            '${receita.titulo}',
            '${receita.descricao}',
            '${receita.tempo}',
            '${receita.foto}',
            if('${video}' = '', NULL, '${video}'),
            '${receita.id_custo}',
            '${receita.id_dificuldade}',
            '${receita.id_porcao}',
            '${receita.id_usuario}'
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = {
    insertReceita
}