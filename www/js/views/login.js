define([
  "backbone",
  "underscore",
  "text!templates/login.html"
  ], function(Backbone, _, loginTemplate) {

    var LoginView = Backbone.View.extend({
      events: {
        'click button.loguear' : 'loguear'
      },
      initialize: function(){
        this.template = _.template(loginTemplate);
      },
      render: function(){
        this.$el.html(this.template());

        this.delegateEvents();

        return this;
      },
      loguear: function(){
        var that = this;

        $.ajax({
          url: 'http://192.168.1.233:9000/register',
          type: 'GET',
          data: {hola: 'pepe'},
          dataType: 'jsonp',
          success: function(data, textStatus, xhr) {
            //that.trigger('logueado');
            var modal = document.querySelector('#login');
            modal.classList.toggle('active');
            that.remove();
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
