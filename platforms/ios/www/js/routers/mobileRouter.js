define(["jquery", "backbone"], 
    function($, Backbone) {

        var AppRouter = Backbone.Router.extend( {
            initialize: function() {
                /*
                this.vehiclesView = new CategoryView({ 
                    el: "#vehicles", 
                    collection: new CategoriesCollection( [] , { type: "vehicles" } ) 
                });*/

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
            },
            routes: {
                "": "home"
            },
            home: function() {
                // Programatically changes to the categories page
                $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );
            }

        } );

        return AppRouter;

    } );