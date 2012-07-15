var http = require('http');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var
  bible = require('./scripts/bible.js'),
  KJV = require('./scripts/KJV.js');
  bible.name = "ASV";
  KJV.name = "KJV";

  bibles = [bible, KJV];
 
http.createServer(function (request, response) {
 
    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    if (request.method == 'POST') {
        var getData = '';
        request.on('data', function(data){
            getData += data;
        });

        request.on('end', function () {
           getData = JSON.parse(getData);
           var currentBible = _.find(bibles, function(bible){return bible.name == getData.currentBible;});
           var currentBook = _.find(currentBible.books, function(book){ return book.name == getData.currentBook});
            response.writeHead(200, {'content-type': 'text/json' });
            response.write( JSON.stringify(currentBook));
            response.end('\n');
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
			case '.png':
				contentType= 'Image';
				break;
			case '.jpg':
				contentType= 'Image';
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

