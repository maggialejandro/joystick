define([
  "jquery",
  "backbone",
  "socketio",
  "views/home",
  "views/joystick",
  "views/login",
  "views/register",
  "models/user"
  ], function($, Backbone, io, HomeView, JoystickView, LoginView, RegisterView, UserModel) {

        var AppRouter = Backbone.Router.extend( {
            initialize: function() {
                window.socket = io.connect('http://192.168.1.233:9000');
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
              var view = new HomeView();
              this.$app.html(view.render().el);
            },
            login: function(){
              var view = new LoginView();
              this.$app.html(view.render().el);
            },
            register: function(){
              var view = new RegisterView();
              this.$app.html(view.render().el);
            },
            game: function(){
              this.joystick = new JoystickView();
              window.socket.emit('jugadorConectado', {
                nombre: App.models.user.get('nombre')
              });
            }

        } );

        return AppRouter;

    } );
