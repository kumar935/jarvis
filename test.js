let url = "https://slack.com/api/conversations.history?token=xoxb-253198866083-918230041412-I4LosIQcAy8NrNGERitOwKv0&channel=C9AK11W2K&limit=50&pretty=1";
const fetch = require("node-fetch");

fetch(url)
    .then(resp => resp.json())
    .then(data => {{
        console.log(data);
    }})
    .catch(err => {
        console.error(err);
    })