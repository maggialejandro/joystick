define(["jquery", "backbone", "socketio", "views/app", "views/joystick"],
    function($, Backbone, io, AppView, JoystickView) {

        var AppRouter = Backbone.Router.extend( {
            initialize: function() {
                //window.socket = io.connect('http://localhost:9000');
                //window.socket.emit('jugadorConectado', {});
                //new AppView();
                this.joystick = new JoystickView();
                Backbone.history.start();
            },
            routes: {
                "": "home"
            },
            home: function() {

            }

        } );

        return AppRouter;

    } );
