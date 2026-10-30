//Import da biblioteca para manipular dados no Banco de dados MySQL
const knex = require('knex')

//import do arquivo de configuração para acesso ao banco de dados
const knexDatabaseConfig = require('../../database_config/knexConfig.js')

//Criar a conexão com o BD Mysql conforme o arquivo de configuração
const knexConection = knex(knexDatabaseConfig.development)

const insertReceita = async function (receita) {
    const video = receita.video ?? ''
    try {
        let sql = `INSERT INTO tbl_receita (
            titulo,
            descricao,
            tempo,
            foto,
            video,
            id_custo,
            id_dificuldade,
            id_porcao,
            id_usuario
        
        ) VALUES (
            '${receita.titulo}',
            '${receita.descricao}',
            '${receita.tempo}',
            '${receita.foto}',
            if('${video}' = '', NULL, '${video}'),
            ${receita.id_custo},
            ${receita.id_dificuldade},
            ${receita.id_porcao},
            ${receita.id_usuario}
        );`

        let result = await knexConection.raw(sql)

        if (result) {
            return result[0].insertId
        } else {
            return false
        }

    } catch (error) {
        console.log(error)
        return false
    }
}


const selectALLReceita = async function () {
    try {
        let sql = 'select * from tbl_receita order by id desc'

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

const selectReceitaByID = async function (idReceita) {
    try {
        let sql = `select * from tbl_receita where id = ${idReceita}`

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

const selectReceitasPorIngredientes = async function (ingredientes) {
    try {

        // Guarda as receitas encontradas
        let receitasEncontradas = []

        // Percorre os ingredientes recebidos
        for (const ingrediente of ingredientes) {

            // Busca as receitas que possuem este ingrediente
            let sql = `
            SELECT DISTINCT tbl_receita.*
            FROM tbl_receita
            INNER JOIN tbl_ingrediente
                ON tbl_receita.id = tbl_ingrediente.id_receita
            WHERE tbl_ingrediente.nome = '${ingrediente}';
            `

            let result = await knexConection.raw(sql)

            if (Array.isArray(result) && Array.isArray(result[0])) {

                // Receitas encontradas para o ingrediente atual
                let receitas = result[0]

                // Percorre as receitas encontradas
                for (const receita of receitas) {

                    // Verifica se a receita já foi adicionada
                    let jaExiste = receitasEncontradas.some(
                        item => item.id == receita.id
                    )

                    // Adiciona somente se ainda não existir
                    if (!jaExiste) {
                        receitasEncontradas.push(receita)
                    }
                }

            } else {

                return false
            }
        }

        return receitasEncontradas

    } catch (error) {
        console.log(error)
        return false
    }
}

const updateReceita = async function (receita) {
    try {
        let sql = `UPDATE tbl_receita SET
            titulo = '${receita.titulo}',
            descricao = '${receita.descricao}',
            tempo = '${receita.tempo}',
            foto = '${receita.foto}',
            video = '${receita.video}',
            id_custo = ${receita.id_custo},
            id_dificuldade = ${receita.id_dificuldade},
            id_porcao = ${receita.id_porcao}
        WHERE id = ${receita.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

const deleteReceita = async function (idReceita) {
    try {

        let sql = `DELETE FROM tbl_receita WHERE id = ${idReceita}`

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
    insertReceita,
    selectALLReceita,
    selectReceitaByID,
    selectReceitasPorIngredientes,
    deleteReceita,
    updateReceita
}