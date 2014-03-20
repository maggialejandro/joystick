define(["backbone"], function(Backbone) {

    var ShipModel = Backbone.Model.extend({
      defaults: {
        angle: 0,
        thrustSize: 0,
        counter: 0
      },
      initialize: function(){

      }

    });

    return ShipModel;
});
