const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertSeguidores = async function(seguidores){
    try{

        let sql = `insert into tbl_seguisdores (
            id_seguindo,
            id_seguidor
            
            
        ) values (
            '${seguidores.id_seguindo}', 
            '${seguidores.id_seguidor}'
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

const selectAllSeguidores = async function(){

    try{

        let sql = 'select * from tbl_seguidores order by id desc'

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

const selectByIdSeguidores = async function(id){
    try{
        let sql = `select * from tbl_seguidores where id=${id}`

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

const deleteSeguidores = async function(id){
    try{
        let sql = `delete from tbl_seguidores where id=${id}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

module.exports ={
    insertSeguidores,
    selectAllSeguidores,
    selectByIdSeguidores,
    deleteSeguidores
}