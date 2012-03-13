var model = function(){
  				var _self =this;				
  				

  				this.bibles = ["ASV", "KJV"];
  				this.currentBible = ko.observable();
	  			this.books =ko.observableArray([]);
	  			this.chapters = ko.observableArray([]);
	  			this.verses = ko.observableArray([]);
	  			this.currentBook = ko.observable();
	  			this.currentChapter = ko.observable();
	  			this.currentBookNumber = ko.observable();
	  			this.currentChapterNumber = ko.observable();

	  			this.currentBible.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters([]);
	  					$.ajax({
			                url: '/bibles/'+newValue,
			                async: true,
			                type: "GET",
			                contentType: 'application/json',
			                success: function(result){			                	
			                	_self.books(result.books);
			                	if(_self.currentBookNumber())
			                		_self.currentBook(_self.books()[_self.currentBookNumber()]);
			                	else
			                		_self.currentBook(_self.books()[0]);
								if(_self.currentChapterNumber())
									_self.currentChapter(_self.currentBook().chapters[_self.currentChapterNumber()]);	
								else
									_self.currentChapter(_self.currentBook().chapters[0]);					
				                }
				            });
  						
  					}
	  			});
	  			this.currentBook.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters(newValue.chapters);
	  					_self.currentBookNumber(newValue.number-1)
	  					if(_self.currentChapterNumber())
									_self.currentChapter(newValue.chapters[_self.currentChapterNumber()]);	
	  				}
  					
	  			});

	  			this.currentChapter.subscribe(function(newValue){
	  				if(newValue){
	  					_self.currentChapterNumber(newValue.number-1);
	  				}
	  			})
	  			

	  		};