define(["jquery", "backbone"], 
    function( $, Backbone) {

        var AppRouter = Backbone.Router.extend( {

            // The Router constructor
            initialize: function() {
                /*
                this.vehiclesView = new CategoryView({ 
                    el: "#vehicles", 
                    collection: new CategoriesCollection( [] , { type: "vehicles" } ) 
                });*/

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();

            },

            // Backbone.js Routes
            routes: {
                // When there is no hash bang on the url, the home method is called
                "": "home"
            },
            home: function() {
                // Programatically changes to the categories page
                $.mobile.changePage( "#home" , { reverse: false, changeHash: false } );
            }

        } );

        return AppRouter;

    } );