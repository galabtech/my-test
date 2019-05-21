var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql')
const fetch = require('node-fetch');


var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mydb',
  connectionLimit: 10
});

pool.getConnection();


// this route will load the words from API to three different db tables in mySyql

router.get('/fetch-tweets', async (req, res) => {
  // get data
  var response = await fetch('https://api.datamuse.com/words?rel_jjb=marketing')
  var data = await response.json();
  // make initial query string
  var query = 'INSERT INTO marketing (word, score) VALUES ';
  // start pushing values
  const values = [];
  for (let i = 0; i < data.length; i++) {
    values.push(`('${data[i].word}',${data[i].score})`)
  };
  // make one string from array of values
  const string = values.join(',');
  // make query
  pool.query(query + string);

  var responsei = await fetch('https://api.datamuse.com/words?rel_jjb=influencer')
  var datai = await responsei.json();
  // make initial query string
  var queryi = 'INSERT INTO influencer (word, score) VALUES ';
  // start pushing values
  const valuesi = [];
  for (let i = 0; i < datai.length; i++) {
    valuesi.push(`('${datai[i].word}',${datai[i].score})`)
  };
  // make one string from array of values
  const stringi = valuesi.join(',');
  // make query
  pool.query(queryi + stringi);

  var responsea = await fetch('https://api.datamuse.com/words?rel_jjb=affiliate')
  var dataa = await responsea.json();
  // make initial query string
  var querya = 'INSERT INTO affiliate (word, score) VALUES ';
  // start pushing values
  const valuesa = [];
  for (let i = 0; i < dataa.length; i++) {
    valuesa.push(`('${dataa[i].word}',${dataa[i].score})`)
  };
  // make one string from array of values
  const stringa = valuesa.join(',');
  // make query
  pool.query(querya + stringa);



  res.json("succeded")


});

// this router will sum the amount of words in every single table- marketing, affiliate, influencer

router.get('/tweet-report', async (req, res) => {
  pool.query('SELECT COUNT(word) FROM marketing', function (error, marketingWordCount, fields) {
    pool.query('SELECT COUNT(word) FROM affiliate', function (error, affiliateWordCount, fields) {
      pool.query('SELECT COUNT(word) FROM influencer', function (error, influencerWordCount, fields) {
        res.json({  marketingWordCount,  affiliateWordCount, influencerWordCount });

      })
    })
  })
});





router.get('/', function (req, res, next) {

  res.render('index', { title: 'Express' });

});

module.exports = router;
