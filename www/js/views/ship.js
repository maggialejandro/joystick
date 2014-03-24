define(["backbone", "models/ship", "vector2"], function(Backbone, ShipModel, Vector2) {

    var ShipView = Backbone.View.extend({
      initialize: function(coordenadas){
        this.model = new ShipModel();

        this.pos = new Vector2(coordenadas);
        this.vel = new Vector2({x: 0, y: 0});
        this.targetVel = new Vector2({x: 0, y: 0});
        this.temp = new Vector2({x: 0, y: 0});

        this.canvas = document.createElement("canvas");

        this.canvas.width = 60;
        this.canvas.height = 60;
        this.canvas.style = "display:block; position:absolute; background-color:'#ff0000';";

        this.canvas.style.webkitTransformOrigin = "30px 30px";
        this.canvas.style.MozTransformOrigin = "30px 30px";
        this.canvas.style.OTransformOrigin = "30px 30px";
        this.canvas.style.transformOrigin = "30px 30px";

        this.context = this.canvas.getContext( '2d' );

      },
      update: function(){
        //speed limit
        var maxSpeed = 30;

        if(this.targetVel.isMagGreaterThan(maxSpeed)){
          this.targetVel.normalise();
          this.targetVel.multiplyEq(maxSpeed);
        }

        if(!this.targetVel.equals(this.vel)) {

          this.temp.copyFrom(this.targetVel);
          this.temp.minusEq(this.vel);

          if(this.temp.isMagGreaterThan(0.001))
            this.temp.multiplyEq(0.3);

          this.vel.plusEq(this.temp);

        }

        this.pos.plusEq(this.vel);

        if(this.vel.isMagGreaterThan(0))
          this.model.set({angle: this.vel.angle()});

        //if(thrustSize>0) thrustSize--;
        this.model.set({
          thrustSize: this.vel.magnitude()
        })

      },
      draw: function(){
        this.context.clearRect(0,0,60,60);
        this.context.fillStyle = "rgba(255,255,255,0.5)";
        this.context.save();
        this.context.translate(30, 30);

        this.context.strokeStyle = "#fff";
        this.context.lineWidth = 2;

        this.context.beginPath();
        this.context.moveTo(-10, -10);
        this.context.lineTo(-10, 10);
        this.context.lineTo(14, 0);
        this.context.closePath();
        this.context.stroke();

        if(this.model.get('thrustSize') > 0) {
          this.context.beginPath();
          this.context.moveTo(-10, -6);

          this.context.lineTo(-10 - (this.model.get('thrustSize')/((this.model.get('counter')%2)+1)) , 0);

          this.context.lineTo(-10, 6);
          //c.closePath();
          this.context.stroke();
          this.model.set({counter: this.model.get('counter')+1});
        }

        this.context.restore();

        var posx = Math.round(this.pos.get('x')-30);
        var posy = Math.round(this.pos.get('y')-30);

        var styleStr = "translate3d("+posx+"px, "+posy+"px, 0px) rotate("+this.model.get('angle')+"deg)";
        this.canvas.style.webkitTransform = styleStr;
        this.canvas.style.MozTransform = styleStr;
        this.canvas.style.OTransform = styleStr;
        this.canvas.style.transform = styleStr;
      }

    });

    return ShipView;
});

