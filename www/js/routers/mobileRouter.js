define(["jquery", "backbone", "socketio", "views/joystick"],
    function($, Backbone, io, JoystickView) {

        var AppRouter = Backbone.Router.extend( {
            initialize: function() {
                window.socket = io.connect('http://190.195.95.181:9000');
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
