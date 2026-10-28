const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidade = async function(comuidade){

    try{
        let sql = `insert into tbl_comunidade (
            foto_url,
            nome,
            banner_url,
            id_categoria_principal,
            descricao
            
        ) values (

            '${comunidade.foto_url}',
            '${comunidade.nome}',
            '${comunidade.banner_url}',
            '${comunidade.id_categoria}',
            '${comunidade.descricao}'
        
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const updateComunidade = async function(comunidade){

    try{
        let sql = `update tbl_update set
                        foto_url = '${comunidade.foto_url}',
                        nome = '${comunidade.nome}',
                        banner_url = '${comunidade.banner_url}',
                        id_categoria_principal = '${comunidade.categoria_principal}',
                        descricao = '${comunidade.descricao}'`

        let result = await knexConection.raw(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error){
        return false
    }
}

const selectAllComunidade = async function(){

    try{
        let sql = 'select * from tbl_comunidade order by id desc'

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

const selectComunidadeById = async function(idComunidade){
    try{
        let sql = `select * from tbl_comunidade where id = ${idComunidade}`

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

const deleteComunidade = async function(id){
    try{
        let sql = `delete from tbl_comunidade where id=${id}`
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
    insertComunidade,
    updateComunidade,
    selectAllComunidade,
    selectComunidadeById,
    deleteComunidade
}