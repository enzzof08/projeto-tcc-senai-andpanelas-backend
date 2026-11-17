
const nodemailer = require('nodemailer')

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


// Envia o código por e-mail
const enviarCodigo = async function(email, codigo, finalidade) {

    try {

        let assunto = 'Verificação de e-mail - EntrePanelas'
        let mensagem = 'Utilize o código abaixo para confirmar seu e-mail no EntrePanelas.'

        if (finalidade === 'recuperar_senha') {

            assunto = 'Recuperação de senha - EntrePanelas'
            mensagem = 'Utilize o código abaixo para recuperar sua senha no EntrePanelas.'

        }

        await transporter.sendMail({

            from: `"EntrePanelas" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: assunto,

            text: `${mensagem} Código: ${codigo}. Este código expira em 10 minutos.`,

            html: `
                <h2>EntrePanelas</h2>
                <p>${mensagem}</p>
                <h1>${codigo}</h1>
                <p>Este código expira em 10 minutos.</p>
            `
        })

        return true

    } catch (error) {

        console.log('Erro ao enviar e-mail:', error)
        throw error

    }
}


module.exports = {
    enviarCodigo
}
