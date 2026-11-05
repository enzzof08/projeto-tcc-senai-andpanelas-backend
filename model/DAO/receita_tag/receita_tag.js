
const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDatabaseConfig.development)

const insertReceitaTag = async function (receitaTag) {
    try {
        let sql = `insert into tbl_tag_receita (
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

const selectTagByIdReceita = async function(idReceita){
    try {
        let sql = `SELECT tbl_tag.nome_tag
                   FROM tbl_receita
                       INNER JOIN tbl_tag_receita
                           ON tbl_receita.id = tbl_tag_receita.id_receita
                       INNER JOIN tbl_tag
                           ON tbl_tag.id = tbl_tag_receita.id_tag
                   WHERE tbl_receita.id = ${idReceita};`

        let result = await knexConection.raw(sql)
        console.log(result)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }

}

const deleteTagsByIdReceita = async function(idReceita){
    try {
        let sql = `delete from tbl_tag_receita where id_receita=${idReceita}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }
    } catch (error) {
        return false
    }
}

module.exports = {
    insertReceitaTag,
    selectTagByIdReceita,
    deleteTagsByIdReceita
}
