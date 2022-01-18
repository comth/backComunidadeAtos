const express = require('express');
const UserConfirmation = require('../models/userConfirmation');

const router = express.Router();

router.post('/create', async (req, res) => {
    const cont = await UserConfirmation.count();
    if(cont <= 69){
        const user = await UserConfirmation.create(req.body);
        return res.send({ user });
    } else {
        return res.status(500).send();
    }   
});

router.get('/all', async (req, res) => {
    const getAllRegisters = await UserConfirmation.find();
    getAllRegisters.forEach(elem => {
        elem.name = elem.name.slice(0,6) + "**********";
    });
    res.send(getAllRegisters);
});

// router.delete('/all', async (req, res) => {
//     const deleteAll = await UserConfirmation.deleteMany();
//     res.send(deleteAll);
// });

router.get('/names', async (req, res) => {
    const getAllRegisters = await UserConfirmation.find();
    var names = [];
    getAllRegisters.forEach(elem => {
        names.push(elem.name);
    });
    names.push('Quantidade de Confirmados: ' + names.length);
    res.send(names);
})

module.exports = app => app.use('/confirmation', router);