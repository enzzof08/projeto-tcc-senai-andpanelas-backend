const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)


const insertGeladeiraIngrediente = async function(ingrediente){
    try {
        let sql = `insert into tbl_geladeira_ingrediente (
            nome_ingrediente,
            id_usuario
        ) values (
            '${ingrediente.nome_ingrediente}',
            ${ingrediente.id_usuario}
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

const selectALLGeladeiraIngrediente = async function (idUsuario) {
    try {
        let sql = `select * FROM tbl_geladeira_ingrediente
                   WHERE id_usuario = ${idUsuario}
                   ORDER BY id DESC`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}

const selectGeladeiraIngredienteByID = async function (idGeladeiraIngrediente) {
    try {
        let sql = `select * FROM tbl_geladeira_ingrediente
                   WHERE id = ${idGeladeiraIngrediente}
                   ORDER BY id DESC`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        return false
    }
}



const deleteGeladeiraIngrediente = async function (idIngrediente) {
    try {

        let sql = `DELETE FROM tbl_geladeira_ingrediente WHERE id = ${idIngrediente}`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertGeladeiraIngrediente,
    selectALLGeladeiraIngrediente,
    deleteGeladeiraIngrediente,
    selectGeladeiraIngredienteByID
}