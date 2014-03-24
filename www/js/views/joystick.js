define([
  "backbone",
  "underscore",
  "jquery",
  "vector2",
  'text!templates/joystick.html',
  "models/joystick",
  "views/ship",
  "views/bullet"
  ], function(Backbone, _, $, Vector2, joystickTemplate, JoystickModel, ShipView, BulletView) {

    var JoystickView = Backbone.View.extend({
      el: $("#app"),
      initialize: function(){

        //Global
        App.models.Vector2Const.temp = new Vector2({
          x: 0,
          y: 0
        });

        this.model = new JoystickModel();

        this.canvas = document.createElement( 'canvas' );
        this.context = this.canvas.getContext( '2d' );

        this.touches = []; // array of touch vectors
        this.bullets = [];
        this.spareBullets = [];

        this.leftTouchPos = new Vector2({x: 0, y: 0});
        this.leftTouchStartPos = new Vector2({x: 0, y: 0});
        this.leftVector = new Vector2({x: 0, y: 0});

        this.template = _.template(joystickTemplate);

        this.render();

      },
      render: function(){
        this.$el.prepend(this.template());
        this.$('.container').html(this.canvas);

        this.resetCanvas();

        this.ship = new ShipView({x: this.model.get('halfWidth'), y: this.model.get('halfHeight')});

        $('.container').after(this.ship.canvas);

        setInterval(this.draw, 1000/200);

        //TODO: usar eventos de hammer.js
        if('createTouch' in document) {
          this.canvas.addEventListener( 'touchstart', this.onTouchStart, false );
          this.canvas.addEventListener( 'touchmove', this.onTouchMove, false );
          this.canvas.addEventListener( 'touchend', this.onTouchEnd, false );

          window.onorientationchange = this.resetCanvas;
          window.onresize = this.resetCanvas;
        } else {
          this.canvas.addEventListener( 'mousemove', this.onMouseMove, false );
        }

      },
      resetCanvas: function(event){
        //BUG: al dar vuelta la pantalla this no es esta vista sino window

        // resize the canvas - but remember - this clears the canvas too.
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.model.set({
          halfWidth: parseInt(this.canvas.width/2),
          halfHeight: parseInt(this.canvas.height/2)
        });

        //make sure we scroll to the top left.
        window.scrollTo(0,0);

        this.context.strokeStyle = "#ffffff";
        this.context.lineWidth = 2;
      },
      draw: function(){
        var that = App.router.joystick;
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

        that.ship.targetVel.copyFrom(that.leftVector);
        that.ship.targetVel.multiplyEq(0.2);

        that.ship.update();

        if(that.ship.pos.get('x') < 0)
          that.ship.pos.set({x: that.canvas.width});
        else if(that.ship.pos.get('x') > that.canvas.width)
          that.ship.pos.set({x: 0});

        if(that.ship.pos.get('y') < 0)
          that.ship.pos.set({y: that.canvas.height});
        else if (that.ship.pos.get('y') > that.canvas.height)
          that.ship.pos.set({y: 0});

        that.ship.draw();

        that.drawBullets();

        that.drawJoysticks();

      },
      drawJoysticks: function(){
        if('createTouch' in document) {
          for(var i=0; i<this.touches.length; i++) {

            var touch = this.touches[i];

            if(touch.identifier == this.model.get('leftTouchID')){
              this.context.beginPath();
              this.context.strokeStyle = "cyan";
              this.context.lineWidth = 6;
              this.context.arc(this.leftTouchStartPos.get('x'), this.leftTouchStartPos.get('y'), 40, 0, Math.PI*2, true);
              this.context.stroke();
              this.context.beginPath();
              this.context.strokeStyle = "cyan";
              this.context.lineWidth = 2;
              this.context.arc(this.leftTouchStartPos.get('x'), this.leftTouchStartPos.get('y'), 60, 0, Math.PI*2, true);
              this.context.stroke();
              this.context.beginPath();
              this.context.strokeStyle = "cyan";
              this.context.arc(this.leftTouchPos.get('x'), this.leftTouchPos.get('y'), 40, 0,Math.PI*2, true);
              this.context.stroke();
            } else {
              this.context.beginPath();
              this.context.fillStyle = "white";
              this.context.fillText("touch id : "+touch.identifier+" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30);

              this.context.beginPath();
              this.context.strokeStyle = "red";
              this.context.lineWidth = "6";
              this.context.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true);
              this.context.stroke();
            }
          }
        } else {
          this.context.fillStyle  = "white";
          this.context.fillText("mouse : "+this.model.get('mouseX')+", "+this.model.get('mouseY'), this.model.get('mouseX'), this.model.get('mouseY'));
        }
      },
      drawBullets: function(){
        for (var i = 0; i < this.bullets.length; i++) {
          var bullet = this.bullets[i];
          if(!bullet.model.get('enabled')) continue;
          bullet.update();
          bullet.draw(this.context);
          if(!bullet.model.get('enabled'))
            this.spareBullets.push(bullet);
        }
      },
      makeBullet: function(){
        var bullet;

        if(this.spareBullets.length>0) {
          bullet = this.spareBullets.pop();

          bullet.reset({
            x: this.ship.pos.get('x'),
            y: this.ship.pos.get('y'),
            angle: this.ship.model.get('angle')
          });

        } else {

          bullet = new BulletView({
            x: this.ship.pos.get('x'),
            y: this.ship.pos.get('y'),
            angle: this.ship.model.get('angle')
          });

          this.bullets.push(bullet);

        }

        bullet.vel.plusEq(this.ship.vel);
      },
      onTouchStart: function(e){
        var that = App.router.joystick;

        for(var i = 0; i < e.changedTouches.length; i++){
          var touch = e.changedTouches[i];

          if((that.model.get('leftTouchID') < 0) && (touch.clientX < that.model.get('halfWidth'))){
            that.model.set({leftTouchID: touch.identifier});
            that.leftTouchStartPos.reset({x: touch.clientX, y: touch.clientY});

            that.leftTouchPos.copyFrom(that.leftTouchStartPos);
            that.leftVector.reset({x: 0, y: 0});
            
            window.socket.emit('move', {x: 0, y: 0});
            continue;
          } else {
            that.makeBullet();

            window.socket.emit('shoot', {});
          }
        }

        that.touches = e.touches;
      },
      onTouchMove: function(e) {
        // Prevent the browser from doing its default thing (scroll, zoom)
        e.preventDefault();

        var that = App.router.joystick;

        for(var i = 0; i<e.changedTouches.length; i++){
          var touch =e.changedTouches[i];
          if(that.model.get('leftTouchID') == touch.identifier){
            that.leftTouchPos.reset({x: touch.clientX, y: touch.clientY});

            that.leftVector.copyFrom(that.leftTouchPos);
            that.leftVector.minusEq(that.leftTouchStartPos);

            window.socket.emit('move', {x: that.leftVector.get('x'), y: that.leftVector.get('y')});
            break;
          }
        }

        that.touches = e.touches;
      },
      onTouchEnd: function(e){
        var that = App.router.joystick;
        that.touches = e.touches;

        for(var i = 0; i<e.changedTouches.length; i++){
          var touch =e.changedTouches[i];
          if(that.model.get('leftTouchID') == touch.identifier){
            that.model.set({leftTouchID: -1});

            that.leftVector.reset({x: 0, y: 0});

            window.socket.emit('move', {x: 0, y: 0});
            break;
          }
        }
      },
      onMouseMove: function(e){
        //console.log(this); //<-- this no es la vista del joystick!
        App.router.joystick.model.set({
          mouseX: e.clientX,
          mouseY: e.clientY
        })
      }

    });

    return JoystickView;
});
