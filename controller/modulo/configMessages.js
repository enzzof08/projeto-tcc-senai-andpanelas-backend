/**************************************************************************************************
 * Objetivo: Arquivo responsável pela padronização das mensagens e status code do projeto 
 * Data: 07/10/2026
 * Autor: Enzzo
 * Versão: 1.0.4.26
 **************************************************************************************************/

//Padronização dos retornos da API (Cabeçalho)
const DEFAULT_MESSAGE = {
    api_description: 'API para controlar o projeto de EntrePanelas',
    development: '4tech',
    version: '1.0.4.26',
    status: Boolean,
    status_code: Number,
    response: {}
}

//Mensagens de ERRO do projeto de EntrePanelas
const ERROR_BAD_REQUEST                = {status: false, status_code: 400, message: 'Não foi possível processar a requisição devido a erros de entrada'}
const ERROR_UNAUTHORIZED              = {status: false, status_code: 401, message: 'Acesso não autorizado porque o usuário não está autenticado ou o token de acesso não foi informado.'}
const ERROR_NOT_FOUND                  = {status: false, status_code: 404, message: 'Não foram encontrados dados para retorno.'}
const ERROR_CONFLICT                   = {status: false, status_code: 409, message: 'Não foi possível concluir a operação porque os dados informados entram em conflito com dados já existentes.'}
const ERROR_CONTENT_TYPE               = {status: false, status_code: 415, message: 'Não foi possível processar os dados encaminhados, pois o formato não é suportado pelo servidor, apenas deve ser utilizado JSON.'}
const ERROR_INTERNAL_SERVER_MODEL      = {status: false, status_code: 500, message: 'Não foi possível processar a requisição devido a um erro interno no servidor [MODEL]'}
const ERROR_INTERNAL_SERVER_CONTROLLER = {status: false, status_code: 500, message: 'Não foi possível processar a requisição devido a um erro interno no servidor [CONTROLLER]'}

//Mensagens de SUCESSO do projeto de EntrePanelas
const SUCCESS_RESPONSE                = {status: true, status_code: 200}
const SUCCESS_UPDATE_ITEM             = {status: true, status_code: 200, message: 'Item atualizado com sucesso!'}
const SUCCESS_DELETED_ITEM            = {status: true, status_code: 200, message: 'Item excluído com sucesso!'}
const SUCCESS_CREATED_ITEM            = {status: true, status_code: 201, message: 'Item inserido com sucesso!'}
const SUCCESS_CREATED_ITEM_WARNING    = {status: true, status_code: 201, message: 'Item inserido com sucesso, porém alguns dados tiveram problemas no cadastro [DADOS DE RELACIONAMENTO]'}


module.exports = {
    DEFAULT_MESSAGE,
    ERROR_BAD_REQUEST,
    ERROR_UNAUTHORIZED,
    ERROR_NOT_FOUND,
    ERROR_CONFLICT,
    ERROR_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_MODEL,
    ERROR_INTERNAL_SERVER_CONTROLLER,
    SUCCESS_RESPONSE,
    SUCCESS_UPDATE_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_CREATED_ITEM,
    SUCCESS_CREATED_ITEM_WARNING
}