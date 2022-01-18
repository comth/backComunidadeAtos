const express = require('express');
const moment = require('moment');
var jwt = require('jsonwebtoken');
const axios = require('axios')
const router = express.Router();
moment.locale('pt-br')

//authentication
router.post('/login', (req, res, next) => {
  var credenciaisValidas = false;
  admins.forEach(x => {
    if (x.user == req.body.user && x.pwd == req.body.pwd) credenciaisValidas = true;
  });

  if (credenciaisValidas) {
    var token = jwt.sign({}, "SEGREDO", {
      expiresIn: 1800
    });
    console.log(Date.now() + "-" + token)
    return res.json({token : token});
  }

  res.status(500).json({erro: 'Credenciais Inválidas!'});
  next();
});

router.post('/recaptcha', (req, res) => {
  axios.post('https://www.google.com/recaptcha/api/siteverify' + '?secret=' + 'secretCaptchaHere' + '&response=' + req.body.response)
  .then(captcha => {
    return res.status(200).send(captcha.data);
  })
})

router.get('/time', (req, res) => {
  return res.status(200).send({ time: moment().tz('America/Sao_Paulo').format('dddd LT')});
})

let admins = [
  {
    user: "joao",
    pwd: "senha123"
  },
  {
    user: "guilherme",
    pwd: "senha123"
  },
  {
    user: "thalita",
    pwd: "senha123"
  },
  {
    user: "saulo",
    pwd: "senha123"
  },
  {
    user: "anderson",
    pwd: "senha123"
  },
  {
    user: "beatriz",
    pwd: "senha123"
  },
]

module.exports = app => app.use('/auth', router);