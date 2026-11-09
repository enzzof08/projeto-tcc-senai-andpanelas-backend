const knex = require('knex')

const knexDatabaseConfig = require('../../database_config/knexConfig')

const knexConection = knex(knexDatabaseConfig.development)

const insertComunidadeUsuario = async function (comunidadeUsuario){
    try{
        let sql = `insert into tbl_comunidade_usuario (
            id_comunidade,
            id_usuario
        )values(
            '${comunidadeUsuario.id_comunidade}',
            '${comuniudadeUsuario.id_usuario}'
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

const selectComunidadeByIdUsuario = async function(idUsuario){
    try{
        let sql = `
            select tbl_comunidade *
                    from tbl_usuario
                        inner join tbl_comunidade_usuario
                            on tbl_usuario.id = tbl_comunidade_usuario.id_usuario
                        inner join tbl_comunidade
                            on tbl_comunidade.id = tbl_comunidade_usuario.id_comunidade
                            
                    where tbl_comunidade_usuario.id=${idUsuario};`
                    
                    
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

const selectUsuarioByIdComunidade = async function(idComunidade){
    try{
        let sql = ` select tbl_usuario *
                    from tbl_comunidade
                        inner join tbl_comunidade_usuario
                            on tbl_comunidade.id = tbl_comunidade_usuario.id_comunidade
                        inner join tbl_usuario
                            on tbl_usuario.id = tbl_comunidade_usuario.id_usuario
                            
                    where tbl_comunidade_usuario.id=${idComunidade};`

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

const deleteComunidadeByIdUsuario = async function(idUsuario){
    try{
        let sql = `delete from tbl_comunidade_usuario where id_usuario=${idUsuario}`
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

const deleteUsuarioByIdComunidade = async function(idComunidade){
    try{
        let sql = `delete from tbl_comunidade_usuario where id_comunidade=${idComunidade}`
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
    insertComunidadeUsuario,
    selectComunidadeByIdUsuario,
    selectUsuarioByIdComunidade,
    deleteComunidadeByIdUsuario,
    deleteUsuarioByIdComunidade
}