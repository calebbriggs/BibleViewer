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
			                }
		            });	  				
	  			};  			

	  		};