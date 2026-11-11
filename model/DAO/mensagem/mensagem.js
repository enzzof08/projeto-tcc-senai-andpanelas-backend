const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertMensagem = async function (mensagem){
    try{
        let sql = `insert into tbl_mensagem (
            conteudo,
            data,
            tipo_remetente,
            id_chefinho_conversa
        )values(
            '${mensagem.conteudo}',
            '${mensagem.data}',
            '${mensagem.tipo_remetente}',
            '${mensagem.id_chefinho_conversa}'
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

const selectAllMensagem = async function(){
    try{
        let sql = 'select * from tbl_mensagem order by id desc'

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

const deleteMensagem = async function(id){
    try {
        let sql = `delete from tbl_mensagem where id=${id}`
        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports ={
    insertMensagem,
    selectAllMensagem,
    deleteMensagem
}