(function ($) {
	String.prototype.contains = function(str){
		return (this.toLowerCase().indexOf(str.toLowerCase()) != -1);
	};

    $.widget('barb.comboBarB', {
		 options: {
				datasource: [],
				valueObject: 'value',
				displayNameObject: 'displayName',
				value: {},			
        },
        _create: function () {
			var self = this,
				o = self.options,
				$el = self.element;
				
			o.spans = [];
				
			self._index = 0;
			self._maxindex = o.datasource.length;
				
			o._datasource = o.datasource;
				
			this._input = $('<input class="ui-comboBarB-input">').width($el.width()).appendTo($el);
				
            this._optionsDiv = $('<div></div>')
                .addClass('ui-comboBarB-div')
				.width($el.width())
                .hide()
                .appendTo($el);
            this._input
               	.bind('focus', $.proxy(this._open, this));
            this._input
			.bind('keydown', function(e){
					if(e.keyCode == 9){
						self._close();
					}
			});
				
			this._input
				.bind('keyup', $.proxy(this._search, this))

			$el
				.bind('mouseleave',$.proxy(this._close, this));
			
        },
		
		_init: function() {
			this.refresh();
		},
		select: function(keycode){
				var self = this,
				o = self.options,
				$el = self.element;				
				self._open();
				
				if(keycode == 40 ){
					
					if(self._index ==  (self._maxindex -1)){
							self._index = 0;
					}
					else{
						self._index++;
					}
					var selectedSpan = o.spans[self._index];
					
					if(selectedSpan){
						selectedSpan.addClass("ui-state-selected");
					}				
				}
				if(keycode == 38 ){
					if(self._index == 0){
						self._index = self._maxindex -1;
					}
					else{
						self._index--;
					}
					var selectedSpan = o.spans[self._index];
					
					if(selectedSpan){
						selectedSpan.addClass("ui-state-selected");
					}
					
				}
				
		 },
		_search: function(e){
			var self = this,
				o = self.options,
				$el = self.element;
								
				if(e.keyCode == 40 || e.keyCode == 38){
						self.select(e.keyCode);
						return false;
				}
				
				if(e.keyCode == 13){				
					var selectedSpan = o.spans[self._index];
					if(selectedSpan){
						selectedSpan.click();
					}
					return false;
				}
														
				o.datasource = _.filter(o._datasource,function(data){
					var dis = typeof data=="function" ? data() : data;
					if(typeof dis == "object"){
						dis = typeof dis[o.displayNameObject] =="function" ? dis[o.displayNameObject]() : dis[o.displayNameObject]
					}					
					return dis.contains(self._input.val());				
				});
				self._maxindex = o.datasource.length;
				self._index = 0;
				
				self._open();
				
		},

        _open: function () {
			var self = this,
				o = self.options,
				$el = self.element;
			var div = $('<div>');
			var spans = [];
			 _.each(o.datasource,function(data){
				var display =data[o.displayNameObject] || data;
				if(typeof display =="function"){display = display();}
				var change = function(){
					var val =data[o.valueObject] || data;
					if(typeof o.value == "function"){					
						if(typeof val== "function")
						{
							o.value(val());
						}
						else
						{
							o.value(val);
						}
					}
					else{					
						if(typeof val== "function")
						{
							o.value=val();
						}
						else
						{
							o.value=val;
						}
					}
					
					self._input.val(display);
					self._close();
				}				
				
				var span = $('<span class = "ui-comboBarB-span ui-widget-border" >'+display+'</span>');
				span.click(change);
				var dis = typeof o.value=="function" ? o.value() : o.value;
				if(typeof dis == "object"){
					dis = typeof dis[o.displayNameObject] =="function" ? dis[o.displayNameObject]() : dis[o.displayNameObject]
				}
				if(dis == display){
					span.addClass('ui-state-selected');
				}
				
				spans.push(span);
				div.append(span);
			});
			o.spans=spans;
			this._optionsDiv.html(div);

            this._optionsDiv.show();
        },
        _close: function () {
			this._optionsDiv.hide();            
        },
		
		refresh: function(){
			  var self = this,
				o = self.options,
				$el = self.element;
			
			o._datasource = o.datasource;
			self._maxindex = o.datasource.length;
			self._index = 0;
			var val = typeof o.value =="function" ? o.value() : o.value;
			
			if(typeof val == "object"){
				self._input.val((val[o.displayNameObject] || ""));
			}
			else{
				self._input.val((val || ""));
			}
		},

        destroy: function () {
            this._optionsDiv.remove();           
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
})(jQuery);