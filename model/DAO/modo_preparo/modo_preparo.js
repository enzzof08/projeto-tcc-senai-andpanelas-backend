const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)


const insertModoPreparo = async function(modoPreparo){
    try {
        let sql = `insert into tbl_modo_preparo (
            ordem_preparo,
            metodo_preparo,
            id_receita
        ) values (
            '${modoPreparo.ordem_preparo}',
            '${modoPreparo.metodo_preparo}',
            ${modoPreparo.id_receita}
        );`
        
        //Encaminha para o BD o scriptSQL
        let result = await knexConection.raw(sql)
        
        if(result)
            return result[0].insertId //Retorna o ID gerado no insert
        else
            return false
        
    } catch (error) {
        
        console.log(error)
        return false
    }
}



module.exports = {
    insertModoPreparo
}