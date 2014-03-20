define(["backbone"], function(Backbone) {

    var JoystickModel = Backbone.Model.extend({
      defaults: {
        leftTouchID: -1
      },
      initialize: function(){

      }

    });

    return JoystickModel;
});
