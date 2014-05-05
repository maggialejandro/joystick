define(function (require) {

  "use strict";

  var $          = require("jquery"),
      Backbone   = require("backbone"),
      io         = require("socketio");

  var UserModel  = require("models/user");

  var AppRouter = Backbone.Router.extend( {
      initialize: function() {
        window.socket = io.connect('ws://server-alejandrojs.rhcloud.com:8000/');
        this.$app = $('#app');
        App.models.user = new UserModel();
      },
      routes: {
        "" : "home",
        "default" : "home",
        "login" : "login",
        "register" : "register",
        "game" : "game"
      },
      home: function() {
        var that = this;
        require(["views/home"], function (HomeView) {
          var view = new HomeView();
          that.$app.html(view.render().el);
        });
      },
      login: function(){
        var that = this;
        require(["views/login"], function (LoginView) {
          var view = new LoginView();
          that.$app.html(view.render().el);
        });
      },
      register: function(){
        var that = this;
        require(["views/register"], function (RegisterView) {
          var view = new RegisterView();
          that.$app.html(view.render().el);
        });
      },
      game: function(){
        var that = this;
        require(["views/joystick"], function (JoystickView) {
          that.joystick = new JoystickView();
          window.socket.emit('jugadorConectado', {
            nombre: App.models.user.get('nombre')
          });
        });
      }
  });

  return AppRouter;
});
