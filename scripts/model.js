var model = function(books){
  				var _self =this;		

  				this.bibles = ["ASV", "KJV"];
  				this.currentBible = ko.observable();
	  			this.books =ko.observableArray(books);
	  			this.chapters = ko.observableArray([]);
	  			this.verses = ko.observableArray([]);
	  			this.currentBook = ko.observable();
	  			this.currentChapter = ko.observable();
	  			this.currentBookNumber = ko.observable();
	  			this.currentChapterNumber = ko.observable();
	  			this.tweets = ko.observableArray([]);

	  			this.random = false;
				this.backAChapter = false;

	  			this.currentBible.subscribe(function (newValue) {
	  				if (newValue && _self.currentBook()) {
	  					getBookFromBible();
	  				}
	  			});
	  		
	  			this.currentBook.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					getBookFromBible();
	  					_self.currentBookNumber(newValue.Number-1);	  						
	  				}
  					
	  			});

	  			this.currentChapter.subscribe(function(newValue){
	  				if(newValue){
	  					_self.currentChapterNumber(newValue.number-1);
	  					getTwitterInfo();
	  				}
	  			});
				
				this.nextChapter = function(){
					if(_self.currentChapterNumber()+1<_self.chapters().length){
						_self.currentChapter(_self.chapters()[_self.currentChapterNumber()+1])
					}
					else{
						if(_self.currentBookNumber()+1<66){
							_self.currentBook(_self.books()[_self.currentBookNumber()+1]);
							_self.currentChapter(_self.chapters()[0]);
						}
					}
				};
				this.previousChapter = function(){
					if(_self.currentChapterNumber()>0){
						_self.currentChapter(_self.chapters()[_self.currentChapterNumber()-1])
					}
					else{
						if(_self.currentBookNumber()>0){
							_self.backAChapter = true;
							_self.currentBook(_self.books()[_self.currentBookNumber()-1]);
							
					}
					}
				}

	  			var getRandomNumber = function(maxNumber){

	  			return Math.floor(Math.random() * (maxNumber)) +1;
	  		};

	  		this.getRandomChapter = function(){
	  			var randombooknumber = getRandomNumber(_self.books().length);
	  			var book = _.find(_self.books(), function(book){return book.Number == randombooknumber;});
	  			_self.random=true;
	  			_self.currentBook(book);
	  			
	  		};

	  		var getTwitterInfo = function(){
	  				var getData = {q: _self.currentBook().Book + " " +_self.currentChapter().number + ":", rpp: 15};
	  				$.ajax({ async: true, url: 'http://search.twitter.com/search.json', data: getData,dataType: "jsonp",
							success: function(data){
								data.results ? _self.tweets(data.results) : _self.tweets([])
							}
						});
	  		}

  			var getBookFromBible = function(){
  				var postData = {currentBible: _self.currentBible(), currentBook: _self.currentBook().Book};
					$.ajax({
	                url: '/',
	                async: true,
	                data: JSON.stringify(postData) ,
	                type: "Post",
	                contentType: 'application/json',
	                success: function(result){			                	
	                	_self.chapters(result.chapters);
	                	
						if(_self.currentChapterNumber()){
							_self.currentChapter(result.chapters[_self.currentChapterNumber()]);
						}
								
						else{
							_self.currentChapter(result.chapters[0]);
						}
							

						if(_self.currentChapterNumber()){
							_self.currentChapter(result.chapters[_self.currentChapterNumber()]);
						}
								

						if(_self.random) {
							var randomchapternumber = getRandomNumber(_self.chapters().length);
		                	var chapter = _.find(_self.chapters(), function(ch){return ch.number == randomchapternumber ;});
	  						_self.currentChapter(chapter);
	  						_self.random=false;
		                }
						if(_self.backAChapter) {
							_self.currentChapter(result.chapters[result.chapters.length-1] );	  						
	  						_self.backAChapter=false;
		                }				
		                }
	                	 
		               
	            });	  				
  			};  			

  		};