var http = require('http');
var fs = require('fs');
var path = require('path');

var
  util = require('util'),
  couchdb = require('felix-couchdb'),
  client = couchdb.createClient(5984, 'localhost'),
  db = client.db('bibleViewer'),
  bible = require('./scripts/bible.js'),
  KJV = bible = require('./scripts/KJV.js');
  bible.name = "ASV";
  KJV.name = "KJV";

  bibles = [bible, KJV];
 
http.createServer(function (request, response) {
 
    console.log('request starting...');

     var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    if (filePath=='./bibles/ASV') {
        response.writeHead(200, {'content-type': 'text/json' });
        response.write( JSON.stringify(bible));
        response.end('\n');
    };
    if (filePath=='./bibles/KJV') {
        response.writeHead(200, {'content-type': 'text/json' });
        response.write( JSON.stringify(KJV));
        response.end('\n');
    };

    if (request.method == 'POST') {
        var postData='';

        request.on('data', function(data){
            postData += data;
        });

        request.on('end', function () {
           console.log('postData received');
           db.saveDoc('bibles', {bibles: postData}, function(er, ok) {
               if (er) throw new Error(JSON.stringify(er));
               util.puts('Saved bibles to the db');
             });

        });
    }
   
        var extname = path.extname(filePath);
        var contentType = 'text/html';
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }
         
        path.exists(filePath, function(exists) {
         
            if (exists) {
                fs.readFile(filePath, function(error, content) {
                    if (error) {
                        response.writeHead(500);
                        response.end();
                    }
                    else {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    }
                });
            }
            else {
                response.writeHead(404);
                response.end();
            }
        });    
     
}).listen(8080);

