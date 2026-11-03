const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertDenuncia = async function(denuncia){
    try{

        let sq1 = `insert into tbl_denuncia (
        data,
        motivo,
        detalhe,
        id_usuario
        ) values (
            '${denuncia.data}',
            '${denuncia.motivo}',
            '${denuncia.detalhe}',
            '${denuncia.id_usuario}
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

const selectAllDenuncia = async function(){
    try{

        let sql = 'select * from tbl_denuncia order by id desc'

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

module.exports = {
    insertDenuncia,
    selectAllDenuncia
}