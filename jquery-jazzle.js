/* jQuery Jazzle */

(function($){
	$.fn.extend({
		jazzleLight: function(options) {
	
			var defaults = {
				color: '#FFFFFF', // Hex, rgb or rgba
				opacity: 0.75, // Float between 0 and 1
				size: '75%', // Any metric (px, %, em)
				left: null, // Any metric (px, %, em)
				top: null, // Any metric (px, %, em)
				
				fadeInterval: 10, // ms between each fadein/fadeout 'tick'
				fadeIncrement: 0.075, // the amount opacity changes per tick
				
				// Events
				fadeOutStart: function(){},
				fadeOutEnd: function(){},
				
				fadeInStart: function(){},
				fadeInEnd: function(){}
			}
			
			var options =  $.extend(defaults, options);
			
			function RGBAColour(colour, alpha){
				var matches, r, g, b;
				var hex_regex = new RegExp('^#([0-9a-f]{1,2})([0-9a-f]{1,2})([0-9a-f]{1,2})$', 'i');
				var rgb_regex = new RegExp('^rgba?\\(([0-9]+)(\s+)?,(\s+)?([0-9]+)(\s+)?,(\s+)?([0-9]+)', 'i');
				matches = hex_regex.exec(colour);
				if(matches){
					r = parseInt(matches[1] + (matches[1].length == 1 ? matches[1] : ''), 16);
					g = parseInt(matches[2] + (matches[2].length == 1 ? matches[2] : ''), 16);
					b = parseInt(matches[3] + (matches[3].length == 1 ? matches[3] : ''), 16);
				}
				else{
					matches = hex_regex.exec(colour);
					if(!matches) throw 'jazzleLight: RGB colour could not be derived from ' + colour;
					r = parseInt(matches[1]);
					g = parseInt(matches[4]);
					b = parseInt(matches[7]);
				}
				return "rgba(" + r + "," + g + "," + b + "," + parseFloat(alpha) + ")";
			}
			
			var endColour = RGBAColour(options.color, 0);
			
			function lightCSS(x, y, activeAlpha){
				
				var backgroundImage;
				var browserPrefix;
				var startColour = RGBAColour(options.color, options.opacity * activeAlpha);
				
				if($.browser.webkit) browserPrefix = '-webkit-';
				else if($.browser.mozilla) browserPrefix = '-moz-';
				else throw 'jazzleLight: unsupported browser';
					
				backgroundImage = browserPrefix + 'radial-gradient(' + x + ' ' + y + ', circle, ' + startColour + ', ' + endColour + ' ' + options.size + ')';
				
				return {
					'background-image': backgroundImage
				}
			}
			
			return this.each(function(){
						  
				var	targetThis = this,
					target = $(this),
					light_x = options.left,
					light_y = options.top,
					activeAlpha = 0,
					activeAlphaInterval;
				
				function updateTarget(){
					target.css(lightCSS(light_x, light_y, activeAlpha));
				}
						  
				target.mousemove(function(e){
					var offset = target.offset();
					if(!options.left) light_x = (e.clientX - offset.left) + 'px';
					if(!options.top) light_y = (e.clientY - offset.top) + 'px';
					updateTarget();
				});
				
				target.mouseover(function(){
					clearInterval(activeAlphaInterval);
					activeAlphaInterval = setInterval(function(){
						activeAlpha += options.fadeIncrement;
						if(activeAlpha >= options.opacity){
							activeAlpha = options.opacity;
							clearInterval(activeAlphaInterval);
							options.fadeInEnd.apply(targetThis);
						}
						updateTarget();
					}, options.fadeInterval);
					
					options.fadeInStart.apply(targetThis);
				});
				
				target.mouseout(function(){
					clearInterval(activeAlphaInterval);
					activeAlphaInterval = setInterval(function(){
						activeAlpha -= options.fadeIncrement;
						if(activeAlpha <= 0){
							activeAlpha = 0;
							clearInterval(activeAlphaInterval);
							options.fadeOutEnd.apply(targetThis);
						}
						updateTarget();
					}, options.fadeInterval);
					
					options.fadeOutStart.apply(targetThis);
				});
						  
			});
		}
	});
})(jQuery);