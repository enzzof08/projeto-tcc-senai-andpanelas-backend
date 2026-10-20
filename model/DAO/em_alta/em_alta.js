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

const updateEmAlta = async function(emAlta){
    try{
        let sql = `update tbl_em_alta set
                        pesquisa = '${emAlta.pesquisa}',
                        data = '${emAlta.data}'`

        
        let result = await knexConection.raw(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const selectAllEmAlta = async function(){
    try {
        let sql = 'select * from tbl_em_alta order by id desc'

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

const deleteEmAlta = async function(id){
    try{
        let sql = `delete from tbl_em_alta where id=${id}`
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
    insertEmAlta,
    updateEmAlta,
    selectAllEmAlta,
    deleteEmAlta
}