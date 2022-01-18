const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const fs = require('fs');
const moment = require('moment');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const UserConfirmation = require('../models/userConfirmation');
const control = require('../models/control');
const UserRegister = require('../models/userRegister');
moment.locale('pt-br')

const oauth2Client = new OAuth2(
  '1033930425550-t4i1smqakgeco2pj8l8skv8j93abejqh.apps.googleusercontent.com', // ClientID
  'clientSecretHere', // Client Secret
  'https://developers.google.com/oauthplayground' // Redirect URL
);

const names = [];
var tableBirthDay;
var mailOptions;

// control.create({ emailMonth: '00'});

oauth2Client.setCredentials({
  refresh_token: '1//04XuQgz3-7DFFCgYIARAAGAQSNwF-L9IrBq2qOCj1wtn_Tl8_MkqXAijCdinq4yWvEJk0z52IVh2bl7nfXpdurBWe84HzuEmTrmQ'
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
       type: 'OAuth2',
       user: 'comunidadeatosautomation@gmail.com', 
       clientId: '1033930425550-t4i1smqakgeco2pj8l8skv8j93abejqh.apps.googleusercontent.com',
       clientSecret: 'KEL92mlJndMQ3jWyTFkYQb_4',
       refreshToken: '1//04XuQgz3-7DFFCgYIARAAGAQSNwF-L9IrBq2qOCj1wtn_Tl8_MkqXAijCdinq4yWvEJk0z52IVh2bl7nfXpdurBWe84HzuEmTrmQ',
       accessToken: accessToken
  }
});

async function sendEmailByScheduler() {
  schedule.scheduleJob('*/1 * * * *', async () => {
    data = await control.find({});
    month = moment().tz('America/Sao_Paulo').format('MM').toString();
    if(data[0].emailMonth !== month) {
      data[0].emailMonth = month;
      await getBirthdayMembers(month, data[0]);
      mailOptions = {
        from: 'comunidadeatosautomation@gmail.com',
        to: 'comunidadeatosautomation@gmail.com, jopspfc@hotmail.com, thalitafercar@gmail.com, bgoulart@uel.br',
        subject: '[Comunidade Atos] Aniversariantes do mês de ' + moment().tz('America/Sao_Paulo').format('MMMM'),
        html: '<b>Segue lista de aniversariantes do mês:</b> <br>' + tableBirthDay + '<br><br><b>Este é um e-mail gerado automaticamente, não é necessário respondê-lo</b>'
      };
      sendGmail(false);
    }

    if (((moment().tz('America/Sao_Paulo').format('dddd').includes('domingo')) && (moment().tz('America/Sao_Paulo').format('LT') == '09:00'))) {
      await getSundayConfirmedPerson();
      mailOptions = {
        from: 'comunidadeatosautomation@gmail.com',
        to: 'comunidadeatosautomation@gmail.com, jopspfc@hotmail.com, thalitafercar@gmail.com',
        subject: '[Comunidade Atos] Irmãos confirmados para ' + moment().tz('America/Sao_Paulo').format('Do MMMM YYYY'),
        html: '<b>Segue lista de irmãos confirmados para o culto de hoje:</b> <br>' + names
      };
      sendGmail(true);
    }
  });
}

function sendGmail(deleteConfirmationMembers) {
  smtpTransport.sendMail(mailOptions, async function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      if(deleteConfirmationMembers)
        await UserConfirmation.deleteMany();
    }
  });
}

async function getSundayConfirmedPerson() {
  const getAllRegisters = await UserConfirmation.find();
  getAllRegisters.forEach(elem => {
      names.push('<br>' + elem.name);
  });
  names.push('<br><br><b>Quantidade de Confirmados: ' + names.length + '</b><br><br> <b>Este é um e-mail automático. Não é necessário respondê-lo.</b>');
}

async function getBirthdayMembers(month, data) {
  getAllRegisters = await UserRegister.find();
  tableBirthDay = '';
  tableBirthDay += '<br><br><table border="1" >';
  getAllRegisters.sort((a, b) => Number(a.birthDate.substring(0,2) - Number(b.birthDate.substring(0,2))));
  getAllRegisters.forEach(elem => {
    if(elem.birthDate.substring(3,5) == month) {
      tableBirthDay += '<tr>';
      tableBirthDay += '<td>' + elem.name + '</td>';
      tableBirthDay += '<td>' + elem.birthDate.substring(0,5) + '</td>';
      tableBirthDay += '</tr>';
    }
  });
  tableBirthDay += '</table><br><br>';
  await control.findOneAndUpdate({ _id: data._id }, data);
}

module.exports.sendEmail = sendEmailByScheduler;