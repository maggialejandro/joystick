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


require(["jquery", "routers/mobileRouter", "underscore", "bootstrap"], 
	function($, Mobile, _){
		$(document).on("mobileinit", function() {
			// Prevents all anchor click handling including the addition of active button state and alternate link bluring.
			$.mobile.linkBindingEnabled = false;
			// Disabling this will prevent jQuery Mobile from handling hash changes
			$.mobile.hashListeningEnabled = false;

			if (!_.isUndefined(window.device) && parseFloat(window.device.version) === 7.0) {
				document.body.style.marginTop = "20px";
			}
		});

		require( [ "jquerymobile" ], function() {
			this.router = new Mobile();

			$.ajax({
				url: 'http://localhost:4500/usuariosmobile',
				type: 'GET',
				dataType: 'jsonp',
				complete: function(xhr, textStatus) {
			    	//called when complete
			    	console.log('complete');
			    },
			    success: function(data, textStatus, xhr) {
				    //called when successful
				    console.log(data);
				},
				error: function(xhr, textStatus, errorThrown) {
				    //called when there is an error
				    console.log('error');
				}
			});
			
		});

        //new MenuView();

		//app.initialize();
	});

