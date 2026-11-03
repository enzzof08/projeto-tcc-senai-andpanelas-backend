const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertDenunciaUsuario = async function (denunciaUsuario){
    try{
        let sql = `insert into tbl_denuncia_usuario (
            id_denuncia,
            id_usuario
        )values(
            '${denunciaUsuario.id_usuario}',
            '${denunciaUsuario.id_categoria}'
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


const selectDenunciaByIdUsuario = async function(idUsuario){
    try{
        let sql = ` select tbl_denuncia *
                    from tbl_usuario
                        inner join tbl_denuncia_usuario
                            on tbl_usuario.id = tbl_denuncia_usuario.id_usuario
                        inner join tbl_denuncia
                            on tbl_denuncia.id = tbl_denuncia_usuario.id_denuncia
                            
                    where tbl_denuncia_usuario.id=${idUsuario};`

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