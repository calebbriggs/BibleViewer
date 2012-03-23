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

	  			this.random = false;

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
	  				}
	  			});

	  			var getRandomNumber = function(maxNumber){

	  			return Math.floor(Math.random() * (maxNumber)) +1;
	  		};

	  		this.getRandomChapter = function(){
	  			var randombooknumber = getRandomNumber(_self.books().length);
	  			var book = _.find(_self.books(), function(book){return book.Number == randombooknumber;});
	  			_self.random=true;
	  			_self.currentBook(book);
	  			
	  		};

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
	                	
						if(_self.currentChapterNumber())
							_self.currentChapter(result.chapters[_self.currentChapterNumber()]);	
						else
							_self.currentChapter(result.chapters[0]);

						if(_self.currentChapterNumber())
							_self.currentChapter(result.chapters[_self.currentChapterNumber()]);	

						if(_self.random) {
							var randomchapternumber = getRandomNumber(_self.chapters().length);
		                	var chapter = _.find(_self.chapters(), function(ch){return ch.number == randomchapternumber ;});
	  						_self.currentChapter(chapter);
	  						_self.random=false;
		                }				
		                }
	                	 
		               
	            });	  				
  			};  			

  		};