var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var _ = require('underscore');

var
  bible = require('./scripts/bible.js'),
  KJV = require('./scripts/KJV.js');
  bible.name = "ASV";
  KJV.name = "KJV";

  bibles = [bible, KJV];
  
 String.prototype.contains = function(str){
	return (this.toLowerCase().indexOf(str.toLowerCase()) != -1);
  }
 
http.createServer(function (request, response) {
 
    var filePath = '.' + request.url;
	var url_parts = url.parse(request.url,true);
	var query = url_parts.query;
		
    if (filePath == './' || query.book) {
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
				response.writeHead(200, {'content-type': 'text/json',
                     'Access-Control-Allow-Origin' : '*' });
				response.write( JSON.stringify(currentBook));
				response.end('\n');
			});
		}
		
		
    }
	else if(filePath == './search'){
				 
		 if (request.method == 'POST') {
				var getSearchData = '';
				request.on('data', function(data){
					getSearchData += data;
				});
				request.on('end', function () {
				   getSearchData = JSON.parse(getSearchData);
					 var searchArray = [];
					 _.each(KJV.books, function(book){ 
						 _.each(book.chapters, function(chapter){
							 _.each(chapter.verses,function(verse){
									searchArray.push( { book: book.name, chapter: chapter.number, verse: verse.number ,text: verse.text});
							});
						});
					 });
					 var searchTerm =getSearchData.searchTerm
					 var verses = _.filter(searchArray, function(verse){
							var chVerse =verse.chapter+":"+verse.verse;
							return verse.text.contains(searchTerm) || (searchTerm.contains(verse.book) && searchTerm.contains(chVerse));
					 });
					 
					response.writeHead(200, {'content-type': 'text/json' });
					response.write( JSON.stringify(verses));
					response.end('\n');
				});
			};

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

