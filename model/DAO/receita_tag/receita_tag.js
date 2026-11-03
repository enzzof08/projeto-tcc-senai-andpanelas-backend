
const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDatabaseConfig.development)

const insertReceitaTag = async function (receitaTag) {
    try {
        let sql = `insert into tbl_receita_categoria (
            id_receita,
            id_tag
        )values (
            '${receitaTag.id_receita}',
            '${receitaTag.id_tag}'
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectCategoriaByIdReceita = async function(idReceita){
    try {
        let sql = `SELECT tbl_tag.nome_tag
                   FROM tbl_receita
                       INNER JOIN tbl_receita_tag
                           ON tbl_receita.id = tbl_receita_tag.id_receita
                       INNER JOIN tbl_tag
                           ON tbl_tag.id_tag = tbl_receita_tag.id_tag
                   WHERE tbl_receita.id = ${idReceita};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        return false
    }

}
