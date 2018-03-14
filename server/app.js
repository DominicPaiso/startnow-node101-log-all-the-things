const express = require('express');
const fs = require('fs');
const app = express();

app.use((req, res, next) => {
    // write your logging code here
    var log = {
        agent: req.headers["user-agent"].replace(',', ' '),
        time: (new Date()).toISOString(),
        method: req.method,
        resource: req.path,
        version: `HTTP/${req.httpVersion}`,
        status: 200,
    }

    // Create an entry for the log file!
    // Figure out how to convert to pure Javascript
    var entry = `${log.agent},${log.time},${log.method},${log.resource},${log.version},${log.status}\n`;
    // Write the log to the log file (log.csv)
    fs.appendFile('./log.csv', entry, function (err) {
        if (err) throw err;
        console.log(entry.substr(0, entry.length - 1));
        next();
    });

});

app.get('/', (req, res) => {
    // write your code to respond "ok" here
    res.send('ok');
});

app.get('/logs', (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile('./log.csv', 'utf8', function (err, data) {
        if (err) throw err; 
        let json = [];
        let lines = data.split('\n');

        let headers = lines.shift().split(',');

        lines.forEach(line => {
            let entry = {};
            let lineEntries = line.split(',');

            for (let i=0;i < headers.length;i++) {
                let header = headers[i];
                entry[header] = lineEntries[i];
            }

            if (entry.Agent !== '') {
                json.push(entry);
            }
        });
        res.json(json);

    });
});


module.exports = app;
