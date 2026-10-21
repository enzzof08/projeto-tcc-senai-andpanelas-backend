
const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDatabaseConfig.development)

const insertReceitaCategoria = async function (receitaCategoria) {
    try {
        let sql = `insert into tbl_receita_categoria (
            id_receita,
            id_categoria
        )values (
            '${receitaCategoria.id_receita}',
            '${receitaCategoria.id_categoria}'
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectCategoriaByIdReceita = async function(idReceita){
    try {
        let sql = ` select tbl_categoria.*
                    from tbl_receita
                        inner join tbl_receita_categoria
                            on tbl_receita.id = tbl_receita_categoria.id_receita
                        inner join tbl_categoria
                            on tbl_categoria.id = tbl_receita_categoria.id_categoria

                    where tbl_receita.id=${idReceita};`

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


const deleteCategoriasByIdReceita = async function(idReceita){
    try {
        let sql = `delete from tbl_receita_categoria where id_receita=${idReceita}`
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
    insertReceitaCategoria,
    selectCategoriaByIdReceita,
    deleteCategoriasByIdReceita
}