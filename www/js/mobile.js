require.config({
	// Sets the configuration for your third party scripts that are not AMD compatible
	shim : {
		underscore: {
			exports: '_'
		},
		"backbone" : {
			"deps" : ["underscore", "jquery"],
			"exports" : "Backbone" //attaches "Backbone" to the window object
		},
		"bootstrap" : {
			"deps" : ["jquery"]
		}
	},
	// Alias
	paths :{
		"jquery" : "libs/jquery",
		"jquerymobile" : "libs/jquery.mobile",
		//"underscore" : "libs/underscore",
		"underscore" : "libs/lodash",
		"backbone" : "libs/backbone",
		"text": "libs/text",
		"bootstrap" : "libs/bootstrap"
	}
});


require(["jquery", "routers/mobileRouter", "bootstrap"], 
	function($, Mobile){
		$(document).on("mobileinit", function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;
		});

		require( [ "jquerymobile" ], function() {
			this.router = new Mobile();
		});

        //new MenuView();

		//app.initialize();
	});