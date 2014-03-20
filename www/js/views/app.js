define(["jquery", "backbone", "underscore", 'text!templates/app.html', "hammer"], 
	function($, Backbone, _, appTemplate, Hammer) {

		var AppView = Backbone.View.extend({
			el: $("#app"),
			initialize: function(){
				this.template = _.template(appTemplate);
				this.render();
			},
			render: function(){
				this.$el.html(this.template());

				var container = document.getElementById('touchArea');
			    var hammertime = new Hammer(container, { drag_max_touches: 0 });
			    hammertime.on("touch", function(ev) {
			    	console.log(ev);
			    	console.log(ev.gesture);
			    	ev.gesture.preventDefault();

			    	window.socket.emit('touched', {
			    		deltaX: ev.gesture.deltaX,
			    		deltaY: ev.gesture.deltaY
			    	})
			    });
			}
		});

		return AppView; 
	});