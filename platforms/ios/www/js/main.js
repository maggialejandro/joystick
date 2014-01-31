require.config({
	shim : {
		underscore: {
			exports: '_'
		},
		"backbone" : {
			"deps" : ["underscore", "jquery"],
			"exports" : "Backbone"
		},
		"bootstrap" : {
			"deps" : ["jquery"]
		}
	},
	paths :{
		"jquery" : "libs/jquery",
		"underscore" : "libs/underscore",
		"backbone" : "libs/backbone",
		"text": "libs/text",
		"bootstrap" : "libs/bootstrap"
	}
});


require(["jquery", 'views/menu', "bootstrap"], 
	function($, MenuView){
		console.log('ok');
		new MenuView();
		//app.initialize();
	});