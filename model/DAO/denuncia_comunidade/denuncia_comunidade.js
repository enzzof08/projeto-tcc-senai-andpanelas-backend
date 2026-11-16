const knex = require ('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertDenunciaComunidade = async function (denunciaComunidade){
    try{
        let sql = `insert into tbl_denuncia_comunidade(
            id_denuncia,
            id_comunidade
        )values(
            '${denunciaComunidade.id_comunidade}',
            '${denunciaComunidade.id_denuncia}'
        );`

        let result = await knexConection.raw(sql)

        if(result){
            return true
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

const selectDenunciaByIdComunidade = async function(idComunidade){
    try{
        let sql = `select tbl_denuncia *
                    from tbl_comunidade
                        inner join tbl_denuncia_comunidade
                            on tbl_comunidade.id = tbl_denuncia_comunidade.id_comunidade
                        inner join tbl_denuncia
                            on tbl_denuncia.id = tbl_denuncia_comunidade.id_denuncia
                            
                    where tbl_denuncia_comunidade.id=${idComunidade};`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    }catch (error){
        return false
    }
}

const selectComunidadeByIdDenuncia = async function(idDenuncia){
    try{
        let sql = `select tbl_comunidade *
                    from tbl_denuncia
                        inner join tbl_denuncia_comunidade
                            on tbl_denuncia.id = tbl_denuncia_comunidade.id_denuncia
                        inner join tbl_comunidade
                            on tbl_comunidade.id = tbl_denuncia_comunidade.id_comunidade`

        let result = await knexConection.raw(sql)

        if(Array.isArray(result)){
            return result[0]
        }else{
            return false
        }

    }catch(error){
        return false
    }
}

module.exports ={
    insertDenunciaComunidade,
    selectDenunciaByIdComunidade,
    selectComunidadeByIdDenuncia
}