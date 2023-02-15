require('dotenv').config()
const request = require('request');
const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
};

async function fetchResult() {
    await axios.get('https://prod-api.cockfightfun.com/api/bet/lottery/info/2301').then(({ data }) => {
        const lottarycode = data.data.lotteryIssueInfo.currentIssue
        const prevcode = parseInt(lottarycode) - 1
        const options = {
            method: "POST",
            url: "https://prod-api.cockfightfun.com/api/bet/lottery/openResult/find",
            headers: {
                "authority": "prod-api.cockfightfun.com",
                "accept": "*/*",
                "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "client-type": "5",
                "companycode": "1000",
                "content-type": "application/json;charset=UTF-8",
                "dnt": "1",
                "isdemo": "0",
                "lang": "en-US",
                "origin": "https://cockfightgame.com",
                "referer": "https://cockfightgame.com/",
                "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "token": process.env.TOKEN,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
            },
            body: JSON.stringify({ "lotteryCode": 2301, "lotteryIssue": prevcode })
        };
        request(options, function (error, response, body) {
            if (error) console.log(error);
            const { data } = JSON.parse(body)
            const bet = data.winResult[0].content == 'WALA' ? 2308 : 2309

            const min = 1000;
            const max = 3000;
            const randomTime = Math.floor(Math.random() * (max - min + 1) + min);
            const clock = randomTime / 1000
            const betplaced = data.winResult[0].content
            const amo = parseInt(process.env.Betamo)

            setTimeout(() => {
                betPlacer(amo, bet, log(amo, betplaced))
                setTimeout(() => { startClock(21 - clock.toFixed(0), 'Result In') }, 1500);
            }, randomTime);
            // startClock(clock.toFixed(0) - 2, 'Next Bet In')
        });
    }).catch(err => {
        console.log(err);
    })
}

async function placeBet(bet, betamo) {
    await axios.get('https://prod-api.cockfightfun.com/api/bet/lottery/info/2301').then(({ data }) => {
        const lottarycode = data.data.lotteryIssueInfo.currentIssue
        const options = {
            method: "POST",
            url: "https://prod-api.cockfightfun.com/api/bet/lottery/order/bet/2301",
            headers: {
                "authority": "prod-api.cockfightfun.com",
                "accept": "*/*",
                "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "client-type": "5",
                "companycode": "1000",
                "content-type": "application/json;charset=UTF-8",
                "dnt": "1",
                "isdemo": "0",
                "lang": "en-US",
                "origin": "https://cockfightgame.com",
                "referer": "https://cockfightgame.com/",
                "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "Windows",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "token": "2052796_B7DA8832258A4F93B071DAFE6087C231",
                "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
            },
            body: JSON.stringify({
                lotteryIssue: lottarycode,
                data: [
                    {
                        betOneMoney: betamo,
                        playChipCode: bet
                    }
                ]
            })
        };
        const betPlaced = bet == 2308 ? 'WALA' : 'MERON'
        const amo = betamo
        request(options, function (error, response, body) {
            if (error) console.log(error);

            const msg = JSON.parse(body).msg
            // process.stdout.write('\x1B[2K\x1B[0F')
            if (msg == 'Insufficient User Balance') {

            } else {
                console.log(body);
            }
        });

        saveData('lastBet', betPlaced)
        saveData('prevbetedLotarycode', lottarycode)
    }).catch((err) => {
        console.log(err);
    })
}

async function run() {
    if (parseInt(process.env.sleep) == 1) {

        const runTime = getRuntime()
        setTimeout(() => {
            const betPlaced = process.env.lastBet
            const code = process.env.prevbetedLotarycode
            checkResult(code, betPlaced)
        }, runTime);
        await fetchResult()
    } else return
}




async function checkResult(lottarycode, prevbet) {
    const options = {
        method: "POST",
        url: "https://prod-api.cockfightfun.com/api/bet/lottery/openResult/find",
        headers: {
            "authority": "prod-api.cockfightfun.com",
            "accept": "*/*",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
            "client-type": "5",
            "companycode": "1000",
            "content-type": "application/json;charset=UTF-8",
            "dnt": "1",
            "isdemo": "0",
            "lang": "en-US",
            "origin": "https://cockfightgame.com",
            "referer": "https://cockfightgame.com/",
            "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "Windows",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "token": process.env.TOKEN,
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
        },
        body: JSON.stringify({ "lotteryCode": 2301, "lotteryIssue": lottarycode })
    }
    await request(options, function (error, response, body) {
        if (error) console.log(error);
        const { data } = JSON.parse(body)
        const result = data.winResult[0].content
        if (result) {
            if (result == prevbet) {
                betresult('won')
                lottaryLogs('win')
                process.stdout.write('\x1B[2K\x1B[0F')
                console.log(` Result : ${result} -> ${colors.green} WON`);
                console.log(`${colors.blue}preparing for next Bet ${colors.reset}`);
            } else {
                betresult('lose')
                lottaryLogs('lose')
                process.stdout.write('\x1B[2K\x1B[0F')
                console.log(` Result : ${result} -> ${colors.red} LOSE`);
                setTimeout(() => {
                    console.log(`${colors.blue}preparing for next Bet ${colors.reset}`)
                }, 900);;
            }
        } else recallCheckResult(lottarycode, prevbet)
    })
}

function recallCheckResult(lottarycode, prevbet) {
    checkResult(lottarycode, prevbet)
}

function betresult(type) {
    if (type == 'won') {
        resetBetamo()
        resetlosecount()
        Analyser()
    } else if (type == 'lose') {
        plusLosecount()
        DoubleBetamo()
        Analyser()
    }
}

function Analyser() {
    const loseCount = process.env.LoseCount
    if (loseCount >= 4) {
        puttoSleep()
    }
}

function puttoSleep() {
    saveData('sleep', false)
    startClock(594, 'sleep ends in')
    setTimeout(() => {
        saveData('sleep', 1)
        resetlosecount()
        console.log('Restarting');
    }, 600000);
}

function resetBetamo() {
    saveData('Betamo', 5)
}
function resetlosecount() {
    saveData('LoseCount', 0)
}
function plusLosecount() {
    const loseCount = process.env.LoseCount
    saveData('LoseCount', parseInt(loseCount) + 1)
}
function DoubleBetamo() {
    const BetAmo = process.env.Betamo
    saveData('Betamo', parseInt(BetAmo) * 2)
}

function lottaryLogs(type) {
    const losetimes = process.env.loseTimes
    const wintimes = process.env.winTimes

    if (type == 'win') {
        saveData('winTimes', parseInt(wintimes) + 1)
    } else {
        saveData('loseTimes', parseInt(losetimes) + 1)
    }
}

function saveData(key, value) {
    process.env[key] = value
    fs.writeFileSync(".env", Object.entries(process.env)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
};

function startClock(seconds, log) {
    let timeRemaining = seconds;

    if (timeRemaining <= 1) return

    const clockInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        console.log(`${colors.reset}${log} : ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        if (timeRemaining <= 0) {
            clearInterval(clockInterval);
            process.stdout.write('\x1b[K');
        } else {
            timeRemaining--;
            // move cursor to the beginning of the line and clear the previous output
            process.stdout.write('\x1B[2K\x1B[0F');
        }
    }, 1000);
}

function amo500(amo, bet) {
    if (amo >= 500) {
        const times = Math.trunc(amo / 500)
        for (let i = 0; i < times; i++) {
            placeBet(bet, 500)
        }
        return amo - (500 * times)
    } else return amo
}


function amo100(amo, bet) {
    if (amo >= 100) {
        const times = Math.trunc(amo / 100)
        for (let i = 0; i < times; i++) {
            placeBet(bet, 100)
        }
        return amo - (100 * times)
    } else return amo
}

function amo50(amo, bet) {
    if (amo >= 50) {
        const times = Math.trunc(amo / 50)
        for (let i = 0; i < times; i++) {
            placeBet(bet, 50)
        }
        return amo - (50 * times)
    } else return amo
}

function amo20(amo, bet) {
    if (amo >= 20) {
        const times = Math.trunc(amo / 20)
        for (let i = 0; i < times; i++) {
            placeBet(bet, 20)
        }
        return amo - (20 * times)
    } else return amo
}

function amo5(amo, bet) {
    if (amo >= 5) {
        const times = Math.trunc(amo / 5)
        for (let i = 0; i < times; i++) {
            placeBet(bet, 5)
        }
        return amo - (5 * times)
    } else return amo
}

async function betPlacer(amo, bet, callback) {
    const check500 = amo500(amo, bet)
    const check100 = amo100(check500, bet)
    const check50 = amo50(check100, bet)
    const check20 = amo20(check50, bet)
    const check5 = amo5(check20, bet)
    callback
}

function log(amo, bet) {
    console.log(`${colors.yellow} Bet placed on ${bet} for ${amo} RS ${colors.reset} #${process.env.betCount}`);
    var count = process.env.betCount
    saveData('betCount', parseInt(count) + 1)
}

function getRuntime() {
    const indianTime = moment().utcOffset('+05:30')
    const exatTime = indianTime.format('hh:mm');
    const oneMinuteLater = indianTime.clone().add(1, 'minute').format('HH:mm');
    const seconds = indianTime.format('ss');

    const time = seconds >= 30 ? `${oneMinuteLater}:10` : `${exatTime}:40`
    function timeGap(time1, time2) {
        const difference = moment(time2, 'HH:mm:ss').diff(moment(time1, 'HH:mm:ss'));
        return difference;
    }
    const gap = timeGap(indianTime, time);
    return gap
}

module.exports = { run: run, checkResult: checkResult }