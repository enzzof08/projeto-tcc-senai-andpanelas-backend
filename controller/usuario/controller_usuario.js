const configMessages = require('../modulo/configMessages.js')

const userDAO = require('../../model/DAO/usuario/usuario.js')

const controllerSeguidores = require('../seguidores/controller_seguidores.js')
const usuarioDAO = require('../../model/DAO/usuario/usuario.js')
const codigoVerificacaoService = require('../../service/codigoVerificacaoService.js')
const codigoVerificacaoDAO = require('../../model/DAO/codigo_verificacao/codigoVerificacao.js')
const emailService = require('../../service/emailService.js')

const bcrypt = require('bcrypt')


const inserirNovoUsuario = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDados(dados)

            if (validar) {
                return validar
            } else {

                const senhaHash = await bcrypt.hash(dados.senha, 10)
                dados.senha = senhaHash

                let result = await userDAO.insertUsuario(await tratarDados(dados))

                if (result === 'DUPLICADO') {
                    customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] JÁ CADASTRADO'
                    return customMessage.ERROR_BAD_REQUEST
                }

                if (result) {

                    // Gera o código de verificação
                    const codigo = codigoVerificacaoService.gerarCodigo()

                    // Gera o hash do código
                    const codigoHash = await codigoVerificacaoService.gerarHashCodigo(codigo)

                    // Define a data de expiração
                    const dataExpiracao = codigoVerificacaoService.gerarDataExpiracao()

                    // Armazena o código no banco
                    let resultCodigo = await codigoVerificacaoDAO.insertCodigoVerificacao({
                        id_usuario: result,
                        finalidade: 'verificar_email',
                        codigo_hash: codigoHash,
                        data_expiracao: dataExpiracao
                    })

                    if (!resultCodigo) {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL
                    }

                    // Envia o código por e-mail
                    let emailEnviado = false

                    try {

                        await emailService.enviarCodigo(
                            dados.email,
                            codigo,
                            'verificar_email'
                        )

                        emailEnviado = true

                    } catch (error) {

                        console.log('Erro ao enviar código:', error)

                    }

                    dados.id = result
                    dados.senha = undefined

                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_CREATED_ITEM.status
                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_CREATED_ITEM.status_code
                    customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_CREATED_ITEM.message

                    customMessage.DEFAULT_MESSAGE.response = {
                        id: result,
                        nome: dados.nome,
                        username: dados.username,
                        email: dados.email,
                        email_verificado: false,
                        email_enviado: emailEnviado
                    }

                    return customMessage.DEFAULT_MESSAGE

                } else {
                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                }
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }

    } catch (error) {

        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }
}


const verificarEmail = async function (dados, idUsuario, contentType) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            // Valida o ID do usuário
            if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || Number(idUsuario) <= 0) {

                customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
                return customMessage.ERROR_BAD_REQUEST

            } else if (dados.codigo == undefined || dados.codigo == null || !/^\d{6}$/.test(String(dados.codigo))) {

                customMessage.ERROR_BAD_REQUEST.field = '[CODIGO] INVÁLIDO'
                return customMessage.ERROR_BAD_REQUEST

            } else {

                // Busca o usuário pelo ID
                let resultUsuario = await usuarioDAO.selectUsuarioById(idUsuario)

                if (resultUsuario) {

                    // Verifica se o e-mail já foi confirmado / 1 = true
                    if (Number(resultUsuario.email_verificado) === 1) {

                        customMessage.DEFAULT_MESSAGE.message = 'E-MAIL JÁ VERIFICADO'
                        return customMessage.DEFAULT_MESSAGE

                    }

                    // Busca o código de verificação
                    let resultCodigo = await codigoVerificacaoDAO.selectCodigoVerificacao(
                        idUsuario,
                        'verificar_email'
                    )

                    if (resultCodigo && resultCodigo.length > 0) {

                        let codigoArmazenado = resultCodigo[0]

                        // Verifica o limite de tentativas
                        if (Number(codigoArmazenado.tentativas) >= 5) {

                            customMessage.ERROR_BAD_REQUEST.field = '[CODIGO] LIMITE DE TENTATIVAS ATINGIDO. SOLICITE OUTRO CÓDIGO'
                            return customMessage.ERROR_BAD_REQUEST

                        }

                        // Verifica se o código expirou
                        let dataExpiracao = codigoArmazenado.data_expiracao instanceof Date
                            ? codigoArmazenado.data_expiracao
                            : new Date(String(codigoArmazenado.data_expiracao).replace(' ', 'T'))

                        if (isNaN(dataExpiracao.getTime()) || dataExpiracao.getTime() <= Date.now()) {

                            await codigoVerificacaoDAO.deleteCodigoVerificacao(
                                idUsuario,
                                'verificar_email'
                            )

                            customMessage.ERROR_BAD_REQUEST.field = '[CODIGO] EXPIRADO. SOLICITE OUTRO CÓDIGO'
                            return customMessage.ERROR_BAD_REQUEST

                        }

                        // Compara o código digitado com o hash armazenado
                        let codigoValido = await codigoVerificacaoService.compararCodigo(
                            String(dados.codigo),
                            codigoArmazenado.codigo_hash
                        )

                        if (codigoValido) {

                            // Atualiza o e-mail como verificado
                            let resultAtualizar = await usuarioDAO.updateEmailVerificado(idUsuario)

                            if (resultAtualizar) {

                                // Exclui o código utilizado
                                let resultExcluir = await codigoVerificacaoDAO.deleteCodigoVerificacao(
                                    idUsuario,
                                    'verificar_email'
                                )

                                if (resultExcluir) {

                                    customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                                    customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                                    customMessage.DEFAULT_MESSAGE.message = 'E-MAIL VERIFICADO COM SUCESSO'
                                    customMessage.DEFAULT_MESSAGE.response = {
                                        email_verificado: true
                                    }

                                    return customMessage.DEFAULT_MESSAGE

                                } else {
                                    return customMessage.ERROR_INTERNAL_SERVER_MODEL
                                }

                            } else {
                                return customMessage.ERROR_INTERNAL_SERVER_MODEL
                            }

                        } else {

                            // Incrementa a quantidade de tentativas
                            let resultTentativas = await codigoVerificacaoDAO.updateTentativasCodigo(
                                idUsuario,
                                'verificar_email'
                            )

                            if (!resultTentativas) {
                                return customMessage.ERROR_INTERNAL_SERVER_MODEL
                            }

                            customMessage.ERROR_BAD_REQUEST.field = '[CODIGO] INCORRETO'
                            return customMessage.ERROR_BAD_REQUEST

                        }

                    } else {

                        customMessage.ERROR_NOT_FOUND.field = '[CODIGO] NÃO ENCONTRADO'
                        return customMessage.ERROR_NOT_FOUND

                    }

                } else {

                    return customMessage.ERROR_NOT_FOUND

                }

            }

        } else {

            return customMessage.ERROR_CONTENT_TYPE

        }

    } catch (error) {

        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}


const reenviarCodigo = async function (idUsuario) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        // Valida o ID
        if (idUsuario == undefined || idUsuario == null || idUsuario == '' || isNaN(idUsuario) || !Number.isInteger(Number(idUsuario)) || Number(idUsuario) <= 0) {

            customMessage.ERROR_BAD_REQUEST.field = '[ID_USUARIO] INVÁLIDO'
            return customMessage.ERROR_BAD_REQUEST

        }

        // Busca o usuário
        let resultUsuario = await usuarioDAO.selectUsuarioById(idUsuario)

        if (!resultUsuario) {
            return customMessage.ERROR_NOT_FOUND
        }

        // Verifica se o e-mail já foi confirmado
        if (Number(resultUsuario.email_verificado) === 1) {

            customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] JÁ VERIFICADO'
            return customMessage.ERROR_BAD_REQUEST

        }

        // Busca o código anterior
        let resultCodigo = await codigoVerificacaoDAO.selectCodigoVerificacao(
            idUsuario,
            'verificar_email'
        )

        if (resultCodigo === false) {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

        // Verifica o intervalo para solicitar outro código
        if (resultCodigo && resultCodigo.length > 0) {

            let dataCriacao = new Date(resultCodigo[0].criado_em)

            if (!isNaN(dataCriacao.getTime()) && Date.now() - dataCriacao.getTime() < 60000) {

                customMessage.ERROR_BAD_REQUEST.field = '[CODIGO] AGUARDE 60 SEGUNDOS PARA SOLICITAR OUTRO'
                return customMessage.ERROR_BAD_REQUEST

            }

        }

        // Gera um novo código
        const codigo = codigoVerificacaoService.gerarCodigo()

        const codigoHash = await codigoVerificacaoService.gerarHashCodigo(codigo)

        const dataExpiracao = codigoVerificacaoService.gerarDataExpiracao()

        // Insere ou atualiza o código no banco
        let result = await codigoVerificacaoDAO.insertCodigoVerificacao({
            id_usuario: idUsuario,
            finalidade: 'verificar_email',
            codigo_hash: codigoHash,
            data_expiracao: dataExpiracao
        })

        if (!result) {
            return customMessage.ERROR_INTERNAL_SERVER_MODEL
        }

        // Envia o novo código por e-mail
        let emailEnviado = false

        try {

            await emailService.enviarCodigo(
                resultUsuario.email,
                codigo,
                'verificar_email'
            )

            emailEnviado = true

        } catch (error) {
            console.log('Erro ao enviar código:', error)
        }

        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
        customMessage.DEFAULT_MESSAGE.message = emailEnviado
            ? 'CÓDIGO REENVIADO COM SUCESSO'
            : 'CÓDIGO GERADO, MAS NÃO FOI POSSÍVEL ENVIAR O E-MAIL'

        customMessage.DEFAULT_MESSAGE.response = {
            email_enviado: emailEnviado
        }

        return customMessage.DEFAULT_MESSAGE

    } catch (error) {

        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER

    }

}

const loginUsuario = async function (dados, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validar = await validarDadosLogin(dados)

            if (validar) {
                return validar
            } else {
                let result = await userDAO.selectUsuarioByEmail(dados.email)
                if (result) {

                    const senhaValida = await bcrypt.compare(dados.senha, result.senha)

                    if (senhaValida) {

                        // Verifica se o e-mail foi confirmado
                        if (Number(result.email_verificado) !== 1) {

                            customMessage.ERROR_UNAUTHORIZED.field = '[EMAIL] NÃO VERIFICADO'
                            return customMessage.ERROR_UNAUTHORIZED

                        }
                        
                        dados.senha = undefined
                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
                        customMessage.DEFAULT_MESSAGE.response = {
                            id: result.id,
                            nome: result.nome,
                            username: result.username,
                            email: result.email
                        }

                        return customMessage.DEFAULT_MESSAGE //201
                    } else {
                        return customMessage.ERROR_UNAUTHORIZED
                    }
                } else {
                    return customMessage.ERROR_UNAUTHORIZED //500
                }
            }
        } else {
            return customMessage.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}

const atualizarUsuario = async function (dados, id, contentType) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase().includes('APPLICATION/JSON')) {

            let BuscaUsuario = await buscarUsuario(id)

            if (BuscaUsuario) {

                let dadosAtualizados = {
                    nome: dados.nome === undefined ? usuario.nome : dados.nome,
                    username: dados.username === undefined ? usuario.username : dados.username,
                    descricao: dados.descricao === undefined ? usuario.descricao : dados.descricao,
                    banner_url: dados.banner_url === undefined ? usuario.banner_url : dados.banner_url,
                    foto_perfil: dados.foto_perfil === undefined ? usuario.foto_perfil : dados.foto_perfil
                }

                let validar = await validarDadosAtualizacao(dadosAtualizados)

                if (validar) {
                    return validar
                } else {

                    dadosAtualizados.id = id

                    let result = await userDAO.updateUsuario(dadosAtualizados, id)
                    console.log(result)
                    if (result) {

                        customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_UPDATE_ITEM.status
                        customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_UPDATE_ITEM.status_code
                        customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_UPDATE_ITEM.message
                        customMessage.DEFAULT_MESSAGE.response = dadosAtualizados

                        return customMessage.DEFAULT_MESSAGE // 200
                    } else {
                        return customMessage.ERROR_INTERNAL_SERVER_MODEL // 500
                    }
                }

            } else {
                return BuscaUsuario
            }

        } else {
            return customMessage.ERROR_CONTENT_TYPE // 415
        }
    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER // 500
    }
}


// User logado é quem esta visitando o outro perfil
// User logado é quem está visitando o outro perfil
const buscarUsuario = async function (idUserPerfil, idUserLogado) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await usuarioDAO.selectUsuarioById(idUserPerfil)

        if (result) {

            let resultReceitas = await usuarioDAO.selectQtdReceitasUsuario(idUserPerfil)

            if (resultReceitas) {
                result.qtd_receitas = resultReceitas.qtd_receitas
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }


            let resultSalvos = await usuarioDAO.selectQtdSalvosUsuario(idUserPerfil)

            if (resultSalvos) {
                result.qtd_salvos = resultSalvos.qtd_salvos
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }

            let resultSeguindo = await usuarioDAO.selectQtdSeguindoUsuario(idUserPerfil)

            if (resultSeguindo) {
                result.qtd_seguindo = resultSeguindo.qtd_seguindo
            } else {
                return customMessage.ERROR_INTERNAL_SERVER_MODEL
            }


            // Verifica se o usuário logado segue o perfil visitado
            if (idUserLogado != undefined) {

                let resultVerificar = await controllerSeguidores.verificarSeguindo(
                    idUserPerfil,
                    idUserLogado
                )

                if (resultVerificar.status) {
                    result.segue_usuario = resultVerificar.response.segue_usuario
                } else {
                    return resultVerificar
                }
            }


            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.message = customMessage.SUCCESS_RESPONSE.message
            customMessage.DEFAULT_MESSAGE.response.usuario = result

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}
const listarTodosUsuarios = async function () {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        let result = await userDAO.selectAllUsuarios()

        if (result && result.length > 0) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.usuarios = result

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuariosPorNome = async function (nome) {

    let customMessage = JSON.parse(JSON.stringify(configMessages))

    try {

        if (nome == undefined || nome == null || nome.trim() == '') {
            customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVALIDO'
            return customMessage.ERROR_BAD_REQUEST
        }

        let result = await userDAO.selectUsuariosPorNome(nome)

        if (result && result.length > 0) {

            customMessage.DEFAULT_MESSAGE.status = customMessage.SUCCESS_RESPONSE.status
            customMessage.DEFAULT_MESSAGE.status_code = customMessage.SUCCESS_RESPONSE.status_code
            customMessage.DEFAULT_MESSAGE.response.count = result.length
            customMessage.DEFAULT_MESSAGE.response.receitas = result

            return customMessage.DEFAULT_MESSAGE

        } else {
            return customMessage.ERROR_NOT_FOUND
        }

    } catch (error) {
        console.log(error)
        return customMessage.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


const validarDados = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (usuario.nome == undefined || usuario.nome == '' || usuario.nome == null || usuario.nome.length > 150) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.username == undefined || usuario.username == '' || usuario.username == null || usuario.username.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[USERNAME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.email == undefined || usuario.email == '' || usuario.email == null || usuario.email.length > 256 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.senha == undefined || usuario.senha == '' || usuario.senha == null || usuario.senha.length > 15) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.foto_perfil != undefined && usuario.foto_perfil != null && usuario.foto_perfil != '' && (usuario.foto_perfil.length > 2000 || !/^https?:\/\/.+/.test(usuario.foto_perfil))) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO DE PERFIL] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.data_nascimento == undefined || usuario.data_nascimento == null || usuario.data_nascimento == '' || !/^\d{4}-\d{2}-\d{2}$/.test(usuario.data_nascimento) || isNaN(new Date(usuario.data_nascimento).getTime())) {
        customMessage.ERROR_BAD_REQUEST.field = '[DATA DE NASCIMENTO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    }
    else {
        return false
    }
}

const validarDadosLogin = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))
    if (usuario.email == undefined || usuario.email == '' || usuario.email == null || usuario.email.length > 256 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        customMessage.ERROR_BAD_REQUEST.field = '[EMAIL] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.senha == undefined || usuario.senha == '' || usuario.senha == null || usuario.senha.length > 15) {
        customMessage.ERROR_BAD_REQUEST.field = '[SENHA] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}


const validarDadosAtualizacao = async function (usuario) {
    let customMessage = JSON.parse(JSON.stringify(configMessages))

    if (usuario.nome == undefined || usuario.nome == null || typeof usuario.nome != 'string' || usuario.nome.trim() == '' || usuario.nome.length > 150) {
        customMessage.ERROR_BAD_REQUEST.field = '[NOME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.username == undefined || usuario.username == null || typeof usuario.username != 'string' || usuario.username.trim() == '' || usuario.username.length > 20) {
        customMessage.ERROR_BAD_REQUEST.field = '[USERNAME] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.descricao != undefined && usuario.descricao != null && (typeof usuario.descricao != 'string' || usuario.descricao.length > 200)) {
        customMessage.ERROR_BAD_REQUEST.field = '[DESCRIÇÃO] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.banner_url != undefined && usuario.banner_url != null && usuario.banner_url != '' && (typeof usuario.banner_url != 'string' || usuario.banner_url.length > 2000 || !/^https?:\/\/.+/i.test(usuario.banner_url))) {
        customMessage.ERROR_BAD_REQUEST.field = '[BANNER] INVÁLIDO'
        return customMessage.ERROR_BAD_REQUEST
    } else if (usuario.foto_perfil != undefined && usuario.foto_perfil != null && usuario.foto_perfil != '' && (typeof usuario.foto_perfil != 'string' || usuario.foto_perfil.length > 2000 || !/^https?:\/\/.+/i.test(usuario.foto_perfil))) {
        customMessage.ERROR_BAD_REQUEST.field = '[FOTO DE PERFIL] INVÁLIDA'
        return customMessage.ERROR_BAD_REQUEST
    } else {
        return false
    }
}

//Função para tratar os dados a serem inseridos
const tratarDados = async function (usuario) {
    usuario.nome = usuario.nome.replaceAll("'", "")
    usuario.data_nascimento = usuario.data_nascimento.replaceAll("'", "")
    usuario.username = usuario.username.replaceAll("'", '')
    usuario.senha = usuario.senha.replaceAll("'", "")
    usuario.email = usuario.email.replaceAll("'", "")

    return usuario
}

module.exports = {
    inserirNovoUsuario,
    loginUsuario,
    buscarUsuario,
    atualizarUsuario,
    buscarUsuariosPorNome,
    listarTodosUsuarios,
    reenviarCodigo,
    verificarEmail
}