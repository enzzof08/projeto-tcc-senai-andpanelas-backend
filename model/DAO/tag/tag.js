const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertTag = async function(tag){

    try{

        let sql = `insert into tbl_tag (
            nome_tag
        ) values (
            '${tag.nome_tag}'
            
        )`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const updateTag = async function(tag){

    try{
        let sql = `update tbl_tag set
                        nome_tag = '${tag.nome_tag}'`

        
        let result = await knexConection.raw(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error){
        return false
    }
}

const selectAllTag = async function(){

    try {

        let sql = 'select * from tbl_tag order by id desc'

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const selectByIdTag = async function(id){
    
    try{
        let sql = `select * from tbl_tag where id=${id}`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

module.exports = {
    insertTag,
    updateTag,
    selectAllTag,
    selectByIdTag
}