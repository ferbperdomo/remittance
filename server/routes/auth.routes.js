const express = require("express")
const User = require("../models/User.model")
const router = express.Router()


router.post('/signup', (req, res, next) => {

    const { email, name } = req.body

    if (email === '' || name === '') {
        res.status(400).json({ message: "Introduce nombre y e-mail." })
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Introduce un correo electrónico válido.' })
        return
    }

    if (req.method === 'POST') {

        User
            .findOne({ email })
            .then((foundUser) => {
                if (foundUser) {
                    res.status(400).json({ message: "El correo electrónico ya está registrado." })
                    return
                }

                return User.create({ email, name })
            })
            .then((createdUser) => {
                const { email, name, _id } = createdUser

                const user = { email, name, _id }

                return res.status(201).json({ user })
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ message: "Internal Server Error" })
            })
    }

})

router.post('/send_email', (req, res) => {
    const { email, name } = req.body

    // User.findOne({ email })
    //     .then(user => {
    //         if (!user) {
    //             res.status(400).json({ message: "El correo electrónico no está registrado." })
    //             return
    //         }
    //         else {

    let auth = {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 2525,
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN,
        expires: 1484314697598
    }


    let mailOptions = {
        from: 'appremitt@gmail.com',
        to: { email },
        subject: 'Gracias por confiar en remitt',
        html: '<p>Gracias por confiar en remitt, tu cuenta ha sido creada con éxito.</p>'
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: auth,
        tls: {
            rejectUnauthorized: false
        }
    })


    transporter.sendMail(mailOptions, (err, res) => {

        if (err) {
            console.log('error', err)
            res.status(500).json({ message: "Internal Server Error" })
            console.log('info', res)
            return
        }
        console.log(JSON.stringify(res))
        res.status(200).json({ message: "Se ha enviado un correo electrónico a tu cuenta." })

    })

})

//         .catch (err => {
//     console.log(err)
//     res.status(500).json({ message: "Internal Server Error" })
// })
// })



module.exports = router
