define([
  "backbone",
  "jquery",
  "underscore",
  "text!templates/register.html",
  "models/user"
  ], function(Backbone, $, _, registerTemplate, UserModel) {

    var LoginView = Backbone.View.extend({
      events: {
        'click button.register' : 'register'
      },
      initialize: function(){
        this.template = _.template(registerTemplate);
        this.user = new UserModel();

        this.user.bind('destroy', this.remove, this);

        this.errores = [];
      },
      render: function(){
        this.$el.html(this.template({
          errores: this.errores,
          user: this.user.toJSON()
        }));

        this.delegateEvents();

        return this;
      },
      register: function(){
        var that = this;
        var $login = $('#login form');

        this.user.set({
          email: $login.find('input[name="email"]').val(),
          name: $login.find('input[name="name"]').val(),
          password: $login.find('input[name="password"]').val()
        });

        //TODO: usar user model
        //modificar backbone.sync
        $.ajax({
          url: 'http://192.168.1.233:9000/create',
          type: 'GET',
          data: this.user.toJSON(),
          dataType: 'jsonp',
          success: function(data, textStatus, xhr) {
            if(data.success){
              var modal = document.querySelector('#login');
              modal.classList.toggle('active');
              that.user.destroy();
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
