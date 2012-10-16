(function ($) {
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
				
				$el.addClass("ui-widget-border");
				
				this._label = $('<label>').text("Choose...").width($el.width()).appendTo($el);
				
            this._optionsDiv = $('<div></div>')
                .addClass('ui-combowiget-div '+'ui-state-highlight ui-corner-all')
				.width($el.width())
                .hide()
                .appendTo($el);
            this.element
                 .bind('mouseenter', $.proxy(this._open, this))
                .bind('mouseleave', $.proxy(this._close, this));
			
        },
		
		_init: function() {
			this.refresh();
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
					self._label.text(display);
				}				
				
				var span = $('<span class = "ui-combowidget-span ui-widget-border" >'+display+'</span>');
				span.click(change);
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
				this._label.text((val[o.displayNameObject] || "Choose ..."));
			}
			else{
				this._label.text((val || "Choose ..."));
			}
		},

        destroy: function () {
            this._optionsDiv.remove();           
            $.Widget.prototype.destroy.apply(this, arguments);
        }
    });
})(jQuery);