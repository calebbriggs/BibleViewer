// node samples/sample.js
var csv = require('csv');
var _ = require('underscore');
var fs = require('fs');
var booksOfTheBible = require('./booksOfTheBible');
var bible = {};
bible.books = [];
var currentBook;
var currentChapter;

var book = function(data){
	this.name = booksOfTheBible[data.book - 1].Book;
	this.number = booksOfTheBible[data.book - 1].Number;
	this.chapters = [];
}

var chapter = function(data){
	this.number = data.chapter;
	this.verses = [];

}
var verse = function(data){
	this.number = data.verse;
	this.text = data.text;

}

csv()
.fromPath('./nodeCSV/KJV.csv')
.toPath('./nodeCSV/bible.txt')
.transform(function(data){
   
    return {book: data[0],chapter: data[1] ,verse: data[2], text: data[3]};
})
.on('data',function(data,index){
	var test =_.find(bible.books, function(book){ return book.number == data.book ; });
	if(!test)
	{
		currentBook = new book(data)
		bible.books.push(currentBook);
	}
	test = _.find(currentBook.chapters, function(chapter){ return chapter.number == data.chapter ; });
	if(!test)
	{
		currentChapter = new chapter(data)
		currentBook.chapters.push(currentChapter);
	}
	currentChapter.verses.push(new verse(data));
})
.on('end',function(count){
    console.log('Number of lines: '+count);
    console.log('Books:' + bible.books.length );
    fs.writeFile("./nodeCSV/KJV.json",JSON.stringify(bible), function(err){console.log(err);});
})
.on('error',function(error){
    console.log(error.message);
});

// Print sth like:
// #0 ["2000-01-01","20322051544","1979.0","8.8017226E7","ABC","45"]
// #1 ["2050-11-27","28392898392","1974.0","8.8392926E7","DEF","23"]
// Number of lines: 2