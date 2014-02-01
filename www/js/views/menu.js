define(["jquery", "backbone", "underscore", 'text!templates/menu.html'], 
	function($, Backbone, _, menuTemplate) {

		var MenuView = Backbone.View.extend({
			el: $("#menu"),
			initialize: function(){
				console.log('menu');

				this.template = _.template(menuTemplate);
				this.render();
			},
			render: function(){
				this.$el.html(this.template());
			}
		});

		return MenuView; 
	});