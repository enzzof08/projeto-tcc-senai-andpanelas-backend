
const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const Fuse = require('fuse.js')

// Função para corrigir o nome de um ingrediente usando o dicionário
const corrigirNomeIngrediente = async function (nomeDigitado) {
    try {

        // Verifica se o nome recebido é válido
        if (typeof nomeDigitado != 'string' || nomeDigitado.trim() == '') {
            return false
        }

        // Remove os espaços extras do começo e do final
        nomeDigitado = nomeDigitado.trim()

        // Busca os nomes corretos que estão cadastrados no dicionário
        let dicionario = await knexConection('tbl_catalogo_ingredientes')
            .select('ingrediente')

        // Se o dicionário estiver vazio, mantém o nome digitado
        if (dicionario.length == 0) {
            return nomeDigitado
        }

        // Configura o Fuse para comparar os nomes dos ingredientes
        const fuse = new Fuse(dicionario, {
            keys: ['ingrediente'],
            threshold: 0.28,
            ignoreDiacritics: true
        })

        // Procura no dicionário um nome parecido com o digitado
        let resultado = fuse.search(nomeDigitado)

        // Se encontrar uma correspondência, retorna o nome do dicionário
        if (resultado.length > 0) {
            return resultado[0].item.ingrediente
        }

        // Se não encontrar uma correspondência, mantém o nome original
        return nomeDigitado

    } catch (error) {
        // Retorna false se ocorrer um erro na consulta ou no processamento
        return false
    }
}

const insertIngrediente = async function(ingrediente){
    try {
        let sql = `insert into tbl_ingrediente (
            nome,
            quantidade,
            id_receita,
            id_unidade_medida
        ) values (
            '${ingrediente.nome}',
            '${ingrediente.quantidade}',
            ${ingrediente.id_receita},
            ${ingrediente.id_unidade_medida}
        );`
        
        //Encaminha para o BD o scriptSQL
        let result = await knexConection.raw(sql)
        
        if(result)
            return result[0].insertId //Retorna o ID gerado no insert
        else
            return false
        
    } catch (error) {

        return false
    }

}


const selectIngredientesPorIdReceita = async function (idReceita) {
    try {
        let sql = `
            SELECT
                tbl_ingrediente.nome,
                tbl_ingrediente.quantidade,
                tbl_unidade_medida.unidade
            FROM tbl_ingrediente
                INNER JOIN tbl_unidade_medida
                    ON tbl_ingrediente.id_unidade_medida = tbl_unidade_medida.id
            WHERE tbl_ingrediente.id_receita = ${idReceita};
        `

        // Encaminha o SELECT para o banco de dados
        let result = await knexConection.raw(sql)

        // Retorna os ingredientes encontrados
        return result[0]

    } catch (error) {
        console.log(error)
        return false
    }
}


module.exports = {
    corrigirNomeIngrediente,
    insertIngrediente,
    selectIngredientesPorIdReceita
}