const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const selectALLUnidadeMedida = async function(){
    try{
        let sql = 'select *from tbl_unidade_medida order by id desc'

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

const selectByIdUnidadeMedida = async function(id){
    try{
        let sql = `select * from tbl_unidade_medida where id=${id}`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }
    }catch(error){
        return false
    }
}

module.exports = {
    selectALLUnidadeMedida
}