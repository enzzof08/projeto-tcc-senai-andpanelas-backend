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