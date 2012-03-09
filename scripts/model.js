var model = function(){
  				var _self =this;

  				bible.name = "ASV";
  				KJV.name = "KJV";

  				this.bibles = [bible, KJV]
  				this.currentBible = ko.observable();
	  			this.books =ko.observableArray([]);
	  			this.chapters = ko.observableArray([]);
	  			this.verses = ko.observableArray([]);
	  			this.currentBook = ko.observable();
	  			this.currentChapter = ko.observable();

	  			this.currentBible.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters([]);
  						_self.books(newValue.books);
  					}
	  			});
	  			this.currentBook.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters(newValue.chapters);	
	  				}
  					
	  			});
	  			

	  		};