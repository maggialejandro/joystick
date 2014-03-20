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
        App.models.Vector2Const.temp = new Vector2(0, 0);

        this.model = new JoystickModel();

        this.canvas = document.createElement( 'canvas' );
        this.context = this.canvas.getContext( '2d' );

        this.touches = []; // array of touch vectors
        this.bullets = [];
        this.spareBullets = [];

        //Vectores: Joysticks?
        this.leftTouchPos = new Vector2(0, 0),
        this.leftTouchStartPos = new Vector2(0, 0),
        this.leftVector = new Vector2(0, 0);

        this.template = _.template(joystickTemplate);

        this.render();

      },
      render: function(){
        this.$el.html(this.template());
        this.$('.container').html(this.canvas);

        this.resetCanvas();

        this.ship = new ShipView(this.model.get('halfWidth'), this.model.get('halfHeight'));

        document.body.appendChild(this.ship.canvas); //TODO: revisar

        //TODO: seguir por aca
        //setInterval(this.draw, 1000/35);
        //this.draw();

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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ship.targetVel.copyFrom(this.leftVector);
        this.ship.targetVel.multiplyEq(0.2);

        this.ship.update();

        //¿¿¿¿ x, y ????????
        with(this.ship.pos) {
          var x = this.ship.pos.get('x');
          var y = this.ship.pos.get('y');
          //console.log(this.ship.pos);
          //console.log(x);
          //console.log(y); //TODO: la Y esta mal

          if(x < 0) x = this.canvas.width;
          else if(x > this.canvas.width) x = 0;
          if(y < 0) y = this.canvas.height;
          else if (y > this.canvas.height) y = 0;
        }

        this.ship.draw();

        var that = this;

        for (var i = 0; i < this.bullets.length; i++) {
          var bullet = this.bullets[i];
          if(!bullet.model.get('enabled')) continue;
          bullet.update();
          bullet.draw(that.context);
          if(!bullet.model.get('enabled'))
            that.spareBullets.push(bullet);
        }

        if('createTouch' in document) {
          for(var i=0; i<this.touches.length; i++) {

            var touch = this.touches[i];

            if(touch.identifier == that.model.get('leftTouchID')){
              that.context.beginPath();
              that.context.strokeStyle = "cyan";
              that.context.lineWidth = 6;
              that.context.arc(that.leftTouchStartPos.get('x'), that.leftTouchStartPos.get('y'), 40, 0, Math.PI*2, true);
              that.context.stroke();
              that.context.beginPath();
              that.context.strokeStyle = "cyan";
              that.context.lineWidth = 2;
              that.context.arc(that.leftTouchStartPos.get('x'), that.leftTouchStartPos.get('y'), 60, 0, Math.PI*2, true);
              that.context.stroke();
              that.context.beginPath();
              that.context.strokeStyle = "cyan";
              that.context.arc(that.leftTouchPos.get('x'), that.leftTouchPos.get('y'), 40, 0,Math.PI*2, true);
              that.context.stroke();
            } else {
              that.context.beginPath();
              that.context.fillStyle = "white";
              that.context.fillText("touch id : "+touch.identifier+" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30);

              that.context.beginPath();
              that.context.strokeStyle = "red";
              that.context.lineWidth = "6";
              that.context.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true);
              that.context.stroke();
            }
          }
        } else {
          this.context.fillStyle  = "white";
          this.context.fillText("mouse : "+this.model.get('mouseX')+", "+this.model.get('mouseY'), this.model.get('mouseX'), this.model.get('mouseY'));
        }

      },
      makeBullet: function(){
        var bullet;

        if(this.spareBullets.length>0) {
          bullet = this.spareBullets.pop();
          bullet.reset(this.ship.pos.get('x'), this.ship.pos.get('y'), this.ship.model.get('angle'));
        } else {

          bullet = new BulletView(this.ship.pos.x, this.ship.pos.y, this.ship.angle);
          this.bullets.push(bullet);

        }

        bullet.vel.plusEq(this.ship.vel);
      },
      onTouchStart: function(e){
        var that = this;

        for(var i = 0; i<e.changedTouches.length; i++){
          var touch =e.changedTouches[i];
          //console.log(leftTouchID + " "
          if((that.model.get('leftTouchID')<0) && (touch.clientX<that.model.get('halfWidth'))){
            that.model.get('leftTouchID') = touch.identifier;
            that.leftTouchStartPos.reset(touch.clientX, touch.clientY);
            that.leftTouchPos.copyFrom(that.leftTouchStartPos);
            that.leftVector.reset(0,0);
            continue;
          } else {
            that.makeBullet();
          }
        }

        this.touches = e.touches;
        console.log('touches');
        console.log(this.touches);
      },
      onTouchMove: function(e) {
        // Prevent the browser from doing its default thing (scroll, zoom)
        e.preventDefault();
        var that = this;

        for(var i = 0; i<e.changedTouches.length; i++){
          var touch =e.changedTouches[i];
          if(that.model.get('leftTouchID') == touch.identifier)
          {
            that.leftTouchPos.reset(touch.clientX, touch.clientY);
            that.leftVector.copyFrom(that.leftTouchPos); //TODO
            that.leftVector.minusEq(that.leftTouchStartPos);  //TODO
            break;
          }
        }

        this.touches = e.touches;
        console.log('touches');
        console.log(this.touches);
      },
      onTouchEnd: function(e){
        this.touches = e.touches;
        var that = this;

        for(var i = 0; i<e.changedTouches.length; i++){
          var touch =e.changedTouches[i];
          if(that.model.get('leftTouchID') == touch.identifier){
            that.model.set({leftTouchID: -1});
            that.leftVector.reset(0,0);
            break;
          }
        }
      },
      onMouseMove: function(e){
        //BUG: this.model undefined
        console.log(e);
        //console.log(this); //<-- this no es la vista del joystick!
        App.router.joystick.model.set({
          mouseX: e.offsetX,
          mouseY: e.offsetY
        })
        console.log(App.router.joystick.model.attributes);
      }

    });

    return JoystickView;
});
