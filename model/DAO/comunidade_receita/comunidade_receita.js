const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidadeReceita = async function (receitaCategoria){
    try{
        let sql = `insert into tbl_receita_categoria (
            id_comunidade,
            id_receita
        )values (
            '${comunidadeReceita.id_comunidade}',
            '${comunidadeReceita.id_receita}'
        );`

        let result = await knexConection.raw(sql)

        if (result){
            return true
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

const selectComunidadeByIdReceita = async function(idReceita){
    try{
        let sql = ` select tbl_comunidade.*
                    from tbl_receita
                        inner join tbl_comunidade_receita
                            on tbl_receita.id = tbl_comunidade_receita.id_receita
                        inner join tbl_comunidade
                            on tbl_comunidade.id = tbl_comunidade_receita.id_comunidade
                            
                    where tbl_receita.id=${idReceita};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result [0]
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const selectReceitaByIdComunidade = async function(idComunidade){
    try{
        let sql = ` select tbl_receita.*
                    from tbl_comunidade
                        inner join tbl_comunidade_receita
                            on tbl_comunidade.id = tbl_comunidade_receita.id_comunidade
                        inner join tbl_receita
                            on tbl_receita.id = tbl_comunidade_receita.id_receita
                            
                    where tbl_comunidade.id=${idComunidade};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result [0]
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const deleteComunidadeByIdReceita = async function(idReceita){
    try{
        let sql = `delete from tbl_comunidade_receita where id_receita={idReceita}`
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

const deleteReceitaByIdComunidade = async function(idComunidade){
    try{
        let sql = `delete from tbl_comunidade_receita where id_comunidade={idComunidade}`
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

module.exports = {
    insertComunidadeReceita,
    selectComunidadeByIdReceita,
    selectReceitaByIdComunidade,
    deleteComunidadeByIdReceita,
    deleteReceitaByIdComunidade
}