define(["backbone"], function(Backbone) {

    var BulletModel = Backbone.Model.extend({
      defaults: {
        speed: 10
      },
      initialize: function(){

      }

    });

    return BulletModel;
});


