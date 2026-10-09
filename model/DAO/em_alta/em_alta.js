const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertEmAlta = async function(emAlta){
    try {
        let sql = `insert into tbl_em_alta (
            pesquisa,
            data
        ) values (
            '${emAlta.pesquisa}',
            '${emAlta.data}' 
        );`

        let result = await knexConection.raw(sql)

        if(result)
            return true
       else
            return false

    } catch (error){
        return false
    }   
}