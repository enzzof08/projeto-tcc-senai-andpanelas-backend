const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertChefinhoConversa = async function (chefinhoConversa){
    try{
        let sql = `insert into tbl_chefinho_conversa(
            data_hora,
            titulo,
            id_usuario
        )values(
            '${chefinho_conversa.data_hora}',
            '${chefinho_conversa.titulo}',
            '${chefinho_conversa.id_usuario}'
        );`

        let result = await knexConection.raw(sql)

        if(result)
            return true
        else
            return false

    }catch(error){
        return false
    }
}

const selectAllChefinhoConversa = async function(){
    try{
        let sql = 'select * from tbl_chefinho_conversa order by id desc'

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result [0]
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

const deleteChefinhoConversa = async function(id){
    try{
        let sql = `delete from tbl_chefinho_conversa where id=${id}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    }catch (error){
        return false
    }
    
}

module.exports ={
    insertChefinhoConversa,
    selectAllChefinhoConversa,
    deleteChefinhoConversa
}