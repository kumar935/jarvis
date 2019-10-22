var args = process.argv.slice(2)

let flow = args[0];

var cp = require('child_process');
cp.fork(__dirname + `/flows/${flow}.js`)
