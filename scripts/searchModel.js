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
								_self.searchResults(result);
								searchCheck = _self.searchTerm();
							}
							
							   
						});	 
					}	
					
				};
				
				this.home = function(){
					window.location = "/";
				}
				

  			

  		};