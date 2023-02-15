require('dotenv').config()

const losebet = process.env.loseTimes
const winbet = process.env.winTimes

console.log('Total Bet : ' + (parseInt(losebet) + parseInt(winbet)));
console.log('Win bet : ' + (parseInt(winbet)));
console.log('Lose bet : ' + (parseInt(losebet)));
console.log('Total Profit : ' + (parseInt(winbet) * 5));