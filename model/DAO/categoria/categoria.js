const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertCategoria = async function(categoria){
    try {

        let sql = `insert into tbl_categoria (
            categoria
            
            
        ) values (
            '${categoria}'
         
        );`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllCategoria = async function(){
    try {

        let sql = 'select * from db_entre_panelas_2026 order by id desc'

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

module.exports = {
    insertCategoria,
    selectAllCategoria
}