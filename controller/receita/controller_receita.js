const configMessages = require('../modulo/configMessages')

const receitaDAO = require('../../model/DAO/receita/receita.js')


const inserirNovaReceita = async function (receita, contentType) {

    //Forma de criar uma cópia dos JSON do arquvio de configuração de mensagens
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            
            let validar = await validarDados(filme)

            //Retorna um JSON de erro caso algum atributo seja inválido,
            //senão retorna um false(Não teve erro)
            if (validar) {
                return validar //400
            } else {

                let result = await receitaDAO.insertReceita(await tratarDados(receita))


                if (result) { //201
                    receita.id = result

                    //Manipulação de dados para Inserir os Generos relacionados ao Filme

                    //Percorre o array de generos que chegará na requisição
                    for (itemGenero of filme.genero) {


                        let filmeGenero = {
                            "id_filme": filme.id,
                            "id_genero": itemGenero.id
                        }


                        let resultFilmeGenero = await controllerFilmeGenero.inserirNovoFilmeGenero(filmeGenero)
                        console.log(resultFilmeGenero)
                        //Validação para verificar se todos os itens de relacionamento foram inseridos
                        if (!resultFilmeGenero.status) {
                            return customMessage.SUCCESS_CREATED_ITEM_WARNING  //201 com alerta de cadastro
                        }

                    }

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message
                    customMessage.DEFAULT_MESSAGE.response = filme

                    return customMessage.DEFAULT_MESSAGE //201

                } else { //erro 500 (Model)
                    console.log(result)
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL //500
                }

            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE //415
        }

    } catch (error) {
        
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }



}




const validarDados = async function (receita) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (receita.titulo == undefined || receita.titulo == '' || receita.titulo == null || receita.titulo.length > 50) {
        customMessage.ERROR_BAD_REQUEST.field = '[TITULO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.descricao == undefined || receita.descricao == '' || receita.descricao == null || receita.descricao.length > 200) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRICAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.tempo == undefined || receita.tempo == '' || receita.tempo == null) {
        customMessage.ERROR_BAD_REQUEST.field = '[TEMPO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.foto.length > 2000 || !/^https?:\/\/.+/.test(receita.foto)) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_porcao == undefined || receita.id_porcao == '' || receita.id_porcao == null || isNaN(receita.id_porcao) || receita.id_porcao <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_PORCAO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_dificuldade == undefined || receita.id_dificuldade == '' || receita.id_dificuldade == null || isNaN(receita.id_dificuldade) || receita.id_dificuldade <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_DIFICULDADE] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else if (receita.id_custo == undefined || receita.id_custo == '' || receita.id_custo == null || isNaN(receita.id_custo) ||receita.id_custo <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_CUSTO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (receita.id_usuario == undefined || receita.id_usuario == '' || receita.id_usuario == null || isNaN(receita.id_usuario) ||receita.id_usuario <= 0) {
        customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    }else {
        return false
    }
}

//Função para tratar os dados a serem inseridos
const tratarDados = async function (receita) {
    //Tratamento para eliminar a chegada da aspas ('') como caracter inválido
    receita.titulo = receita.titulo.replaceAll("'", "")
    receita.descricao = receita.descricao.replaceAll("'", "")
    receita.tempo = receita.tempo.replaceAll("'", '')
    receita.foto = filme.foto.replaceAll("'", "")

    return receita
}


