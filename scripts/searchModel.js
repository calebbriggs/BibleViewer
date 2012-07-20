var model = function(){
  				var _self =this;		
				var searchCheck = null;
  				
  				this.searchTerm = ko.observable();
				this.searchResults =ko.observableArray([]);

				this.searchResultLength = ko.computed(function(){
					return _self.searchResults().length;
				});
	
				this.getSearchData = function(){
					if(searchCheck != _self.searchTerm()){
					
						var postData = {searchTerm: _self.searchTerm()};
						$.ajax({
							url: '/search',
							async: true,
							data: JSON.stringify(postData) ,
							type: "Post",
							contentType: 'application/json',
							success: function(result){
								var searchResult=_.map(result,function(verse){
									verse.click = function(){
										window.location = "/?book=" +verse.book +"&&chapter="+ verse.chapter; 
									}
									return verse;
								});
								
								_self.searchResults(searchResult);
								searchCheck = _self.searchTerm();
							}
							
							   
						});	 
					}	
					
				};
				this.home = function(){
					window.location = "/";
				}
				
				
				

  			

  		};