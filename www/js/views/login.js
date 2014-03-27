define([
  "jquery",
  "backbone",
  "underscore",
  "text!templates/login.html",
  "models/user"
  ], function($, Backbone, _, loginTemplate, UserModel) {

    var LoginView = Backbone.View.extend({
      events: {
        'click button.login' : 'login'
      },
      initialize: function(){
        this.template = _.template(loginTemplate);
        this.user = new UserModel();

        this.user.bind('destroy', this.remove, this);

        this.errores = [];
      },
      render: function(){
        this.$el.html(this.template({
          errores: this.errores,
          user: this.user.toJSON()
        }))

        return this;
      },
      login: function(){
        var that = this;
        var $loginForm = this.$('form');

        this.user.set({
          email: $loginForm.find('input[name="email"]').val(),
          password: $loginForm.find('input[name="password"]').val()
        });

        //TODO: usar user model
        //modificar backbone.sync
        $.ajax({
          url: 'http://192.168.1.233:9000/login',
          type: 'GET',
          data: this.user.toJSON(),
          dataType: 'jsonp',
          success: function(data, textStatus, xhr) {
            if(data.success){
              that.user.destroy();
              App.models.user.set({nombre: data.user.name});
              App.router.navigate("game", {trigger: true});
            }else{
              that.errores = [];

              _.each(data.errors, function(value, index){
                that.errores.push({
                  message: value.message
                })
              });

              that.render();
            }
          },
          error: function(xhr, textStatus, errorThrown) {
            alert('error');
            console.log('error');
          }
        });
      }

    });

    return LoginView;
});
