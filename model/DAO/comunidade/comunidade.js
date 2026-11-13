const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidade = async function(comunidade){

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
            '${comunidade.id_categoria_principal}',
            '${comunidade.descricao}'
        
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        }else{
            return false
        }

    } catch (error){
        console.log(error)
        return false
    }
}

const updateComunidade = async function(comunidade){

    try{
        let sql = `update tbl_comunidade set
                        foto_url = '${comunidade.foto_url}',
                        nome = '${comunidade.nome}',
                        banner_url = '${comunidade.banner_url}',
                        id_categoria_principal = '${comunidade.id_categoria_principal}',
                        descricao = '${comunidade.descricao}'`

        let result = await knexConection.raw(sql)
        
        if(result)
            return true
        else
            return false

    } catch (error){
        console.log(error)
        return false
    }
}

const selectAllComunidade = async function(){

    try {
        let sql = `
            SELECT
                tbl_comunidade.*,
                tbl_categoria_principal.categoria_principal
            FROM tbl_comunidade
                INNER JOIN tbl_categoria_principal
                    ON tbl_categoria_principal.id = tbl_comunidade.id_categoria_principal
            ORDER BY tbl_comunidade.id DESC;
        `

        let result = await knexConection.raw(sql)

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

const selectComunidadeById = async function(idComunidade){
    try {
        let sql = `
            SELECT
                tbl_comunidade.*,
                tbl_categoria_principal.categoria_principal
            FROM tbl_comunidade
                INNER JOIN tbl_categoria_principal
                    ON tbl_categoria_principal.id = tbl_comunidade.id_categoria_principal
            WHERE tbl_comunidade.id = ?;
        `

        let result = await knexConection.raw(sql, [idComunidade])

        if (Array.isArray(result)) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
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