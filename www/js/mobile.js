require.config({
  // Sets the configuration for your third party scripts that are not AMD compatible
  shim : {
    "underscore": {
      "exports": '_'
    },/*
    "ratchet": {
        "exports": 'ratchet',
        "deps" : ["jquery"]
    },*/
    "backbone" : {
      "deps" : ["underscore", "jquery"],
      "exports" : "Backbone" //attaches "Backbone" to the window object
    },/*
    "bootstrap" : {
      "deps" : ["jquery"]
    },
    "jquery.mobile": {
      "deps" : ["jquery"]
    }*/
  },
  paths :{
    "jquery" : "libs/jquery",
    //"jquery.mobile" : "libs/jquery.mobile",
    //"underscore" : "libs/underscore",
    "underscore" : "libs/lodash",
    "backbone" : "libs/backbone",
    "text": "libs/text",
    //"bootstrap" : "libs/bootstrap",
    "socketio" : "libs/socket.io",
    "ratchet" : "libs/ratchet",
    //"hammer" : "libs/hammer",
    "vector2" : "libs/vector2"
  }
});


require(["jquery", "routers/mobileRouter", "underscore", "ratchet"],
  function($, MobileRouter, _, io){
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
          //document.addEventListener('deviceready', function() { //TODO: es necesario para phonegap?
              App.router = new MobileRouter();
          //}, false);
      } else {
          App.router = new MobileRouter();
      }
  });

