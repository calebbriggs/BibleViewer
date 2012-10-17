(function ($) {
	String.prototype.contains = function(str){
		return (this.toLowerCase().indexOf(str.toLowerCase()) != -1);
	};

    $.widget('barb.comboWidget', {
		 options: {
				datasource: [],
				valueObject: 'value',
				displayNameObject: 'displayName',
				value: {}
				
        },
        _create: function () {
			var self = this,
				o = self.options,
				$el = self.element;
				
				o._datasource = o.datasource;
				
				$el.addClass("ui-widget-border");
				
				this._input = $('<input class="ui-comboWidget-input">').val("Choose...").width($el.width()).appendTo($el);
				
            this._optionsDiv = $('<div></div>')
                .addClass('ui-combowiget-div')
				.width($el.width())
                .hide()
                .appendTo($el);
            this.element
                 .bind('mouseenter', $.proxy(this._open, this))
                .bind('mouseleave', $.proxy(this._close, this));
				
			this._input
				.bind('keyup', $.proxy(this._search, this));
			
        },
		
		_init: function() {
			this.refresh();
		},
		
		_search: function(){
			var self = this,
				o = self.options,
				$el = self.element;
				
				o.datasource = _.filter(o._datasource,function(data){
					var dis ;
					if(typeof data == "object"){
						dis = typeof data[o.displayNameObject] =="function" ? data[o.displayNameObject]() : data[o.displayNameObject]
					}
					else{
						dis = data
					}
					return dis.contains(self._input.val());				
				});
				
				self._open();
		},

        _open: function () {
			var self = this,
				o = self.options,
				$el = self.element;
			var div = $('<div>');
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
				
				var span = $('<span class = "ui-combowidget-span ui-widget-border" >'+display+'</span>');
				span.click(change);
				var dis = typeof o.value=="function" ? o.value() : o.value;
				if(typeof dis == "object"){
					dis = typeof dis[o.displayNameObject] =="function" ? dis[o.displayNameObject]() : dis[o.displayNameObject]
				}
				if(dis == display){
					span.addClass('ui-state-selected');
				}
				div.append(span);
			});
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
				
			var val = typeof o.value =="function" ? o.value() : o.value;
			
			if(typeof val == "object"){
				self._input.val((val[o.displayNameObject] || "Choose ..."));
			}
			else{
				self._input.val((val || "Choose ..."));
			}
		},

        destroy: function () {
            this._optionsDiv.remove();           
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
})(jQuery);