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

const selectComunidadeById = async function (idComunidade) {
    return await knexConection('tbl_comunidade')
        .select('nome', 'descricao', 'foto_url', 'banner_url', 'id_categoria_principal')
        .where({ id: idComunidade })
        .first()
}

const insertDenunciaComunidade = async function (idComunidade, denuncia) {
    return await knexConection.transaction(async function (trx) {
        let [idDenuncia] = await trx('tbl_denuncia').insert({
            motivo: denuncia.motivo,
            detalhe: denuncia.detalhe,
            id_usuario: denuncia.id_usuario
        })

        await trx('tbl_denuncia_comunidade').insert({
            id_comunidade: idComunidade,
            id_denuncia: idDenuncia
        })
    })
}

const selectTotalDenunciasComunidade = async function (idComunidade) {
    let resultado = await knexConection('tbl_denuncia_comunidade')
        .where({ id_comunidade: idComunidade })
        .count({ total: '*' })
        .first()

    return Number(resultado.total)
}

const deleteComunidadeComDenuncias = async function (idComunidade) {
    return await knexConection.transaction(async function (trx) {
        let idsDenuncia = await trx('tbl_denuncia_comunidade')
            .where({ id_comunidade: idComunidade })
            .pluck('id_denuncia')

        await trx('tbl_denuncia_comunidade').where({ id_comunidade: idComunidade }).del()
        await trx('tbl_denuncia').whereIn('id', idsDenuncia).del()
        await trx('tbl_comunidade').where({ id: idComunidade }).del()
    })
}

module.exports = {
    insertDenuncia,
    selectAllDenuncia,
    selectComunidadeById,
    insertDenunciaComunidade,
    selectTotalDenunciasComunidade,
    deleteComunidadeComDenuncias
}