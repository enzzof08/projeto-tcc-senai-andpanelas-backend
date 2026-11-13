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

const insertDenunciaVinculada = async function (tabela, colunaItem, idItem, denuncia) {
    return await knexConection.transaction(async function (trx) {
        let [idDenuncia] = await trx('tbl_denuncia').insert({
            motivo: denuncia.motivo,
            detalhe: denuncia.detalhe,
            id_usuario: denuncia.id_usuario
        })

        await trx(tabela).insert({
            [colunaItem]: idItem,
            id_denuncia: idDenuncia
        })
    })
}

const selectTotalDenuncias = async function (tabela, colunaItem, idItem) {
    let resultado = await knexConection(tabela)
        .where({ [colunaItem]: idItem })
        .count({ total: '*' })
        .first()

    return Number(resultado.total)
}

const selectReceitaCompleta = async function (idReceita) {
    let receita = await knexConection('tbl_receita')
        .select('titulo', 'descricao', 'foto', 'video', 'tempo')
        .where({ id: idReceita })
        .first()

    if (!receita) return undefined

    let [ingredientes, modo_preparo, categorias, tags] = await Promise.all([
        knexConection('tbl_ingrediente')
            .join('tbl_unidade_medida', 'tbl_unidade_medida.id', 'tbl_ingrediente.id_unidade_medida')
            .select('tbl_ingrediente.nome', 'tbl_ingrediente.quantidade', 'tbl_unidade_medida.unidade as id_unidade_medida')
            .where({ 'tbl_ingrediente.id_receita': idReceita }),
        knexConection('tbl_modo_preparo')
            .select('metodo_preparo', 'ordem_preparo')
            .where({ id_receita: idReceita })
            .orderBy('ordem_preparo'),
        knexConection('tbl_receita_categoria')
            .join('tbl_categoria', 'tbl_categoria.id', 'tbl_receita_categoria.id_categoria')
            .where({ 'tbl_receita_categoria.id_receita': idReceita })
            .pluck('tbl_categoria.categoria'),
        knexConection('tbl_tag_receita')
            .join('tbl_tag', 'tbl_tag.id', 'tbl_tag_receita.id_tag')
            .where({ 'tbl_tag_receita.id_receita': idReceita })
            .pluck('tbl_tag.nome_tag')
    ])

    return { ...receita, ingredientes, modo_preparo, categorias, tags }
}

const deleteReceitaComDenuncias = async function (idReceita) {
    return await knexConection.transaction(async function (trx) {
        let idsDenuncia = await trx('tbl_denuncia_receita')
            .where({ id_receita: idReceita })
            .pluck('id_denuncia')

        await trx('tbl_comentario').where({ id_receita: idReceita }).del()
        await trx('tbl_salvo').where({ id_receita: idReceita }).del()
        await trx('tbl_curtida').where({ id_receita: idReceita }).del()
        await trx('tbl_denuncia_receita').where({ id_receita: idReceita }).del()
        await trx('tbl_denuncia').whereIn('id', idsDenuncia).del()
        await trx('tbl_receita').where({ id: idReceita }).del()
    })
}

const selectUsuarioParaModeracao = async function (idUsuario) {
    let usuario = await knexConection('tbl_usuario')
        .select('nome', 'username', 'descricao', 'foto_perfil', 'banner_url')
        .where({ id: idUsuario })
        .first()

    if (!usuario) return undefined

    let comentarios = await knexConection('tbl_comentario')
        .where({ id_usuario: idUsuario })
        .limit(500)
        .pluck('comentario')

    return { ...usuario, comentarios }
}

const atualizarUsuario = async function (idUsuario, dados) {
    return await knexConection('tbl_usuario').where({ id: idUsuario }).update(dados)
}

module.exports = {
    insertDenuncia,
    selectAllDenuncia,
    selectComunidadeById,
    insertDenunciaComunidade,
    selectTotalDenunciasComunidade,
    deleteComunidadeComDenuncias,
    insertDenunciaVinculada,
    selectTotalDenuncias,
    selectReceitaCompleta,
    deleteReceitaComDenuncias,
    selectUsuarioParaModeracao,
    atualizarUsuario
}