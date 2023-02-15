require('dotenv').config()
const request = require('request');
const fs = require('fs');
const moment = require('moment');

function login() {
    const options = {
        method: 'POST',
        url: 'https://prod-api.cockfightfun.com/api/bet/user/login_v2',
        headers: {
            'authority': 'prod-api.cockfightfun.com',
            'accept': '*/*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
            'client-type': '5',
            'companycode': '1000',
            'content-type': 'application/json;charset=UTF-8',
            'dnt': '1',
            'isdemo': '0',
            'lang': 'en-US',
            'origin': 'https://cockfightgame.com',
            'referer': 'https://cockfightgame.com/',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'Windows',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'token': '',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
            username: '9746968996',
            password: 'cch9szwd26',
            smsCode: '0',
            challenge: '',
            validate: '',
            seccode: '',
            cid: ''
        })
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        const { data } = JSON.parse(body)
        if (data.token) {
            saveData('TOKEN', data.token)
        } else {
            console.log('something went wrong');
        }
    });

}

function saveData(key, value) {
    process.env[key] = value
    fs.writeFileSync(".env", Object.entries(process.env)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
};

module.exports = { login: login }