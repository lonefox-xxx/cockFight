const moment = require('moment');
const { login } = require('./login');
const builder = require('./placebet')
const fs = require('fs');
const readline = require('readline');

console.log('Want to login first y/n');

const runTime = getRuntime()
const indianTime = moment().utcOffset('+05:30')
const exatTime = indianTime.format('HH:mm:ss');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let isActive = true;

process.stdin.on('keypress', (key, data) => {
    if (key === 'y') {
        login()
        setTimeout(() => {
            setInterval(() => {
                builder.run()
            }, 30000);
        }, runTime);

        const clock = runTime / 1000
        startClock(parseInt(clock.toFixed(0)) + 28, 'Starts In')
        isActive = false;
        process.stdout.write('\x1B[2K\x1B[0F');
        console.log('login sucsess');
        process.stdin.setRawMode(false);
    } else if (key == 'n') {
        setTimeout(() => {
            setInterval(() => {
                builder.run()
            }, 30000);
        }, runTime);

        const clock = runTime / 1000
        startClock(parseInt(clock.toFixed(0)) + 28, 'Starts In')
        isActive = false;
        process.stdout.write('\x1B[2K\x1B[0F');
        console.log('continueing without login');
        process.stdin.setRawMode(false);
    }
});

process.stdin.on('close', () => {
    console.log('Terminal closed');
});

(function wait() {
    if (isActive) {
        setTimeout(wait, 1);
    }
})();



// console.log(parseInt(clock.toFixed(0)) + 28);

function getRuntime() {
    const indianTime = moment().utcOffset('+05:30')
    const exatTime = indianTime.format('HH:mm:ss');
    const oneMinuteLater = indianTime.clone().add(1, 'minute').format('HH:mm');
    const withSecond = `${oneMinuteLater}:42`
    const gap = timeGap(indianTime, withSecond);
    return gap
}

function timeGap(time1, time2) {
    const difference = moment(time2, 'HH:mm:ss').diff(moment(time1, 'HH:mm:ss'));
    return difference;
}

function startClock(time, log) {
    let timeRemaining = time;

    if (timeRemaining <= 1) return

    const clockInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        console.log(`${log} : ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        if (timeRemaining <= 0) {
            const exatTime = indianTime.clone().add(time, 'seconds').format('HH:mm:ss');
            clearInterval(clockInterval);
            process.stdout.write('\x1B[2K\x1B[0F');
            console.log(`Started at : ${exatTime}`);
        } else {
            timeRemaining--;
            // move cursor to the beginning of the line and clear the previous output
            process.stdout.write('\x1B[2K\x1B[0F');
        }
    }, 1000);
}

function saveData(key, value) {
    process.env[key] = value
    fs.writeFileSync(".env", Object.entries(process.env)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n")
    );
};

saveData('betCount', 1)