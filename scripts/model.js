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
	  			this.currentVerse = ko.observable();

	  			this.currentBible.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters([]);
	  					_self.currentVerse(null);
  						_self.books(newValue.books);
  					}
	  			});
	  			this.currentBook.subscribe(function(newValue){
	  				if(newValue)
	  				{
	  					_self.chapters(newValue.chapters);	
	  				}
  					
	  			});
	  			this.currentChapter.subscribe(function(newValue){
  					// _self.verses(newValue.verses);
  					if(newValue)
	  				{
	  					var chapter = ""
	  					_.each(newValue.verses, function(Verse){ chapter += " "+ Verse.number + " "+ Verse.text });

	  					_self.currentVerse(chapter);
  					}
	  			});

	  		};