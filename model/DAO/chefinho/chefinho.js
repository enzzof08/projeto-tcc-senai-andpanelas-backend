const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const selectConversaById = async function (idConversa) {
    return await knexConection('tbl_chefinho_conversa')
        .where({ id: idConversa })
        .first()
}

const selectUltimasMensagens = async function (idConversa, limite) {
    let mensagens = await knexConection('tbl_mensagem')
        .select('tipo_remetente as papel', 'conteudo as mensagem')
        .where({ id_chefinho_conversa: idConversa })
        .orderBy('id', 'desc')
        .limit(limite)

    return mensagens.reverse()
}

const insertMensagens = async function (idConversa, pergunta, resposta) {
    return await knexConection('tbl_mensagem').insert([
        { conteudo: pergunta, tipo_remetente: 'user', id_chefinho_conversa: idConversa },
        { conteudo: resposta, tipo_remetente: 'agente', id_chefinho_conversa: idConversa }
    ])
}

const insertConversa = async function (titulo, idUsuario) {
    let [id] = await knexConection('tbl_chefinho_conversa').insert({
        titulo,
        id_usuario: idUsuario
    })

    return id
}

const selectConversasPorUsuario = async function (idUsuario) {
    return await knexConection('tbl_chefinho_conversa')
        .select('id', 'titulo', 'data_hora')
        .where({ id_usuario: idUsuario })
        .orderBy('id', 'desc')
}

const selectMensagensPorConversa = async function (idConversa) {
    return await knexConection('tbl_mensagem')
        .select('id', 'tipo_remetente', 'conteudo', 'data_hora')
        .where({ id_chefinho_conversa: idConversa })
        .orderBy('id', 'asc')
}

const deleteConversa = async function (idConversa) {
    await knexConection('tbl_mensagem').where({ id_chefinho_conversa: idConversa }).del()

    return await knexConection('tbl_chefinho_conversa').where({ id: idConversa }).del()
}

module.exports = {
    selectConversaById,
    selectUltimasMensagens,
    insertMensagens,
    insertConversa,
    selectConversasPorUsuario,
    selectMensagensPorConversa,
    deleteConversa
}