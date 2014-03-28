define([
  "backbone",
  "underscore",
  'text!templates/home.html'
  ], function(Backbone, _, homeTemplate) {

		var HomeView = Backbone.View.extend({
      events: {
        'click .register' : 'register',
        'click .login' : 'login',
        'click .play' : 'play'
      },
			initialize: function(){
				this.template = _.template(homeTemplate);
			},
			render: function(){
				this.$el.html(this.template());

        return this;
			},
      register: function(){
        App.router.navigate("register", {trigger: true});
      },
      login: function(){
        App.router.navigate("login", {trigger: true});
      },
      play: function(){
        App.router.navigate("game", {trigger: true});
      }

		});

		return HomeView;
	});
