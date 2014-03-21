define([
  "backbone",
  "vector2",
  "models/bullet"
  ], function(Backbone, Vector2, BulletModel) {

    var BulletView = Backbone.View.extend({
      initialize: function(bulletOptions){
        this.model = new BulletModel();
        this.reset(bulletOptions);
      },
      update: function() {
        this.pos.plusEq(this.vel);
        this.model.set({life: this.model.get('life')--});

        if(this.get('life') < 0) this.model.set({enabled: false});

      },
      reset: function(bulletOptions){
        this.pos = new Vector2({x: bulletOptions.x, y: bulletOptions.y});
        var unitv = new Vector2({x: 1, y: 0});

        // instead set Vector with speed and rotate
        unitv.rotate(bulletOptions.angle);

        this.vel = unitv.clone();
        this.vel.multiplyEq(this.model.get('speed'));

        unitv.multiplyEq(10);
        this.pos.plusEq(unitv);

        this.model.set({
          enabled: true,
          life: 50
        });

      },
      draw: function(context) {
        if(!this.get('enabled')) return;

        context.lineWidth =2;
        context.strokeStyle = "#fff";
        context.beginPath();
        context.arc(this.pos.x,this.pos.y,2, 0, Math.PI*2, true);
        context.stroke();

      }

    });

    return BulletView;
});
