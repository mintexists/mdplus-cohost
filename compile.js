// download https://oat.zone/markdown-plus/assets/index.5c9e63cd.js with nodejs
const download = require('download');
const { exec } = require('child_process');
const fs = require('fs');

const url = 'https://oat.zone/markdown-plus/assets/index.5c9e63cd.js';

download(url).then(data => {
    // base64 decode
    let b64 = data.toString().split("sourceMappingURL=data:application/json;charset=utf-8;base64,")[1];
    let buf = Buffer.from(b64, 'base64');
    let str = buf.toString();
    // write to file
    fs.writeFile('tmp/index.js.map', str, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});

// run command `shuji tmp/index.js.map -o tmp` in terminal
let cmd = 'shuji tmp/index.js.map -o tmp';
exec(cmd, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    // console.log(stdout);
});

const file = 'tmp/tmp/converter.js';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/export async (?=function parse)/gm, '')
data += '\nwindow.parse = parse;'
console.log(data)
fs.writeFileSync('converter.js', data, 'utf8');

let cmd2 = './node_modules/.bin/esbuild converter.js --bundle --outfile=out.js --format=esm'
exec(cmd2, (err, stdout, stderr) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});