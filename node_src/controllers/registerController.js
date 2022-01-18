const express = require('express');
const UserRegister = require('../models/userRegister');
var jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/create', async (req, res) => {
    const user = await UserRegister.create(req.body);
    return res.send({ user });
});

router.get('/all', verifyJWT, async (req, res) => {
    const getAllRegisters = await UserRegister.find();
    res.send(getAllRegisters);
});

router.get('/excel', verifyJWT, async(req, res) => {
    const getAllUsers = await UserRegister.find();
    const format = 
    {
        fields: { 
                  _id:'string',
                  name:'string',
                  phone:'string',
                  birthDate:'string'
                }
    };
    res.xls('file.xlsx', getAllUsers, format);
});

router.delete('/:id', verifyJWT, async (req, res) => {
    let deleteResponse = await UserRegister.deleteOne({id: req.params.id});
    if(deleteResponse.deletedCount == 0){
        res.sendStatus(404);
    }
    res.send();
});

router.put('', verifyJWT, async (req, res) => {
    let updateResponse = await UserRegister.findOneAndUpdate({ id: req.body.id}, req.body, {
        returnOriginal: true
    });

    if(!updateResponse || updateResponse.nModified == 0){
        res.sendStatus(404);
    }
    else{
        res.send();
    } 
});

function verifyJWT(req, res, next) {
    var token = req.headers['authorization'] + "";
    token = token.replace("Bearer ","");
    console.log(token);
    if (!token) return res.status(401).json({ erro: 'No token provided.' });

    jwt.verify(token, "SEGREDO", function (err, decoded) {
        if (err) return res.status(403).json({ erro: 'Failed to authenticate token.' });
        next();
    });
}

module.exports = app => app.use('/register', router);