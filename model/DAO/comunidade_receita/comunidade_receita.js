const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidadeReceita = async function (comunidadeReceita){
    try{
        let sql = `insert into tbl_comunidade_receita (
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
        console.log(error)

        if (error.code === 'ER_DUP_ENTRY') {
            return 'DUPLICADO'
        }
        
        return false
    }
}

const selectComunidadeByIdReceita = async function(idReceita) {
    try {
        let sql = `
            SELECT
                tbl_comunidade.id,
                tbl_comunidade.foto_url,
                tbl_comunidade.nome,
                tbl_comunidade.banner_url,
                tbl_comunidade.descricao,
                tbl_categoria_principal.categoria_principal
            FROM tbl_receita
                INNER JOIN tbl_comunidade_receita
                    ON tbl_receita.id = tbl_comunidade_receita.id_receita
                INNER JOIN tbl_comunidade
                    ON tbl_comunidade.id = tbl_comunidade_receita.id_comunidade
                INNER JOIN tbl_categoria_principal
                    ON tbl_comunidade.id_categoria_principal = tbl_categoria_principal.id
            WHERE tbl_receita.id = ${idReceita};
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

const selectReceitaByIdComunidade = async function(idComunidade){
    try{
        const sql = `
            SELECT tbl_receita.*
            FROM tbl_comunidade_receita
            INNER JOIN tbl_receita
                ON tbl_receita.id = tbl_comunidade_receita.id_receita
            WHERE tbl_comunidade_receita.id_comunidade = ?
            ORDER BY tbl_receita.id DESC;
        `

        const result = await knexConection.raw(sql, [idComunidade])

        if(Array.isArray(result)){
            return result [0]
        }else{
            return false
        }

    } catch (error){
        return false
    }
}

const selectComunidadeReceita = async function(id){
    try{
        let sql = `select from tbl_comunidade_receita where id=${id}`
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

const deleteComunidadeByIdReceita = async function(idReceita){
    try{
        let sql = `delete from tbl_comunidade_receita where id_receita=${idReceita}`
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
        let sql = `delete from tbl_comunidade_receita where id_comunidade=${idComunidade}`
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

const selectQuantidadeReceitasPorComunidade = async function(idComunidade){
    try {
        let sql = `
            SELECT COUNT(*) AS qtd_receitas
            FROM tbl_comunidade_receita
            WHERE id_comunidade = ?;
        `

        let result = await knexConection.raw(sql, [idComunidade])

        if (Array.isArray(result)) {
            return result[0][0].qtd_receitas
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertComunidadeReceita,
    selectComunidadeByIdReceita,
    selectReceitaByIdComunidade,
    deleteComunidadeByIdReceita,
    deleteReceitaByIdComunidade,
    selectComunidadeReceita,
    selectQuantidadeReceitasPorComunidade
}