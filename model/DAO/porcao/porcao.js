const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const selectallPorcao = async function(){
    try {
        let sql = 'select * from tbl_porcao order by id desc'

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

const selectByIdPorcao = async function(id){
    try{
        let sql = `select * from tbl_porcao where id=${id}`

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
    selectallPorcao,
    selectByIdPorcao
}