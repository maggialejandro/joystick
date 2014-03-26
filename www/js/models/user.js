define(["backbone"], function(Backbone) {

    var UserModel = Backbone.Model.extend({
      initialize: function(){
        url: 'api/users'
      }
    });

    return UserModel;
});
