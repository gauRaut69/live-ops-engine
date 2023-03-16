const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_CODE = 'jdadgdttyitqwebbvnhjn'

const {offer} = require('../schema/offerSchema')

const getUserByToken = (token)=>{
    return new Promise((resolve, reject)=> {
        if(token){
            let userData
            try{
               userData = jwt.verify(token, SECRET_CODE);
               resolve(userData)
            }catch(err){
                reject("Invalid Token")
            }
        }else{
            reject("Token not found")
        }
    })
}

router.get('/list', async(req, res)=> {
    const validOffers = [];
    offer.find().then((offer)=> {
        // console.log(offer, "offer list")
        offer.filter((offer)=> {
            const rules = offer.target.split("and")
            rules.forEach((rule)=> {
                let ruleKey = {}
                if(rule.includes(">")){
                    ruleKey = {key: rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1])}
                    if(req.body[ruleKey.key] > ruleKey.value){
                        validOffers.push(offer)
                    }
                }
                else{
                    ruleKey = {key: rule.trim().split("<")[0], value: parseInt(rule.trim().split("<")[1])}
                    if(req.body[ruleKey.key] < ruleKey.value){
                        validOffers.push(offer)
                    }
                }
            })
        })
        res.status(200).send(validOffers)
    }).catch(()=> {
        res.status(500).send("Internal Server Error")
    })
});

router.post('/create', async(req, res)=> {
    getUserByToken(req.headers.authorization).then((user)=> {
        // res.status(200).send(user)
        //create a offer based on user
        offer.create({...req.body, username: user.username}).then((offer)=> {
            res.status(200).send(offer);
        }).catch((err)=> {
            res.status(400).send({message: err.message})
        })
    }).catch((err)=> {
        res.status(400).send(err);
    })
})

router.put('/update', async()=> {
    offer.updateOne("identifier data")
});

router.put('/delete', async()=> {
    offer.deleteOne({_id: req.body.id})
});

module.exports = router;