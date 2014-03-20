define(["backbone"], function(Backbone) {

    var Vector2 = Backbone.Model.extend({
      defaults: {
        x: 0,
        y: 0,
        TO_DEGREES: 180 / Math.PI,
        TO_RADIANS: Math.PI / 180,
      },
      initialize: function(x, y){
        this.reset(x, y);
      },
      reset: function(x, y){
        this.set({
          x: x,
          y: y
        });
      },
      toString: function(decPlaces){
        decPlaces = decPlaces || 3;
      var scalar = Math.pow(10,decPlaces);
      return "[" + Math.round (this.get('x') * scalar) / scalar + ", " + Math.round (this.get('y') * scalar) / scalar + "]";
      },
      magnitude: function(){
        return Math.sqrt((this.get('x')*this.get('x'))+(this.get('y')*this.get('y')));
      },
      magnitudeSquared : function () {
      return (this.get('x')*this.get('x'))+(this.get('y')*this.get('y'));
    },
    normalise : function () {
      var m = this.magnitude();
      this.reset(this.get('x')/m, this.get('y')/m);
    },
    reverse: function(){
      this.reset(-this.get('x'), -this.get('y'));
    },
    multiplyEq: function(scalar){
      this.reset(this.get('x')*scalar, this.get('y')*scalar);
    },
    divideEq: function (scalar) {
      this.reset(this.get('x')/=scalar, this.get('y')/=scalar);
    },
    angle: function (useRadians) {
      return Math.atan2(this.get('y'),this.get('x')) * (useRadians ? 1 : this.get('TO_DEGREES'));
    },
    clone: function () {
      return new Vector2(this.get('x'), this.get('y'));
    },
    copyTo: function (v) {
      v.reset(this.get('x'), this.get('y'));
    },
    copyFrom: function (v) {
      this.reset(v.get('x'), v.get('y'));
    },
    plusEq: function (v) {
      this.reset(this.get('x')+v.get('x'), this.get('y')+v.get('y'));
    },
    plusNew: function (v) {
      return new Vector2(this.get('x')+v.get('x'), this.get('y')+v.get('y'));
    },
    minusEq: function (v) {
      this.reset(this.get('x')-v.get('x'), this.get('y')-v.get('y'));
    },
    minusNew: function (v) {
      return new Vector2(this.get('x')-v.get('x'), this.get('y')-v.get('y'));
    },
    rotate: function (angle, useRadians) {
      var cosRY = Math.cos(angle * (useRadians ? 1 : this.get('TO_RADIANS')));
      var sinRY = Math.sin(angle * (useRadians ? 1 : this.get('TO_RADIANS')));

      App.models.Vector2Const.temp.copyFrom(this);

      this.set({
        x: (App.models.Vector2Const.temp.get('x')*cosRY)-(App.models.Vector2Const.temp.get('y')*sinRY),
        y: (App.models.Vector2Const.temp.get('x')*sinRY)+(App.models.Vector2Const.temp.get('y')*cosRY)
      });

      return this;
    },
    equals: function (v) {
      return((this.get('x')==v.get('x'))&&(this.get('y')==v.get('x'))); //v.x?
    },
    isCloseTo: function (v, tolerance) {
      if(this.equals(v)) return true;

      App.models.Vector2Const.temp.copyFrom(this);
      App.models.Vector2Const.temp.minusEq(v);

      return(App.models.Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
    },
    rotateAroundPoint: function (point, angle, useRadians) {
      App.models.Vector2Const.temp.copyFrom(this);
      //trace("rotate around point "+t+" "+point+" " +angle);
      App.models.Vector2Const.temp.minusEq(point);
      //trace("after subtract "+t);
      App.models.Vector2Const.temp.rotate(angle, useRadians);
      //trace("after rotate "+t);
      App.models.Vector2Const.temp.plusEq(point);
      //trace("after add "+t);
      this.copyFrom(App.models.Vector2Const.temp);
    },
    isMagLessThan: function (distance) {
      return(this.magnitudeSquared()<distance*distance);
    },
    isMagGreaterThan: function (distance) {
      return(this.magnitudeSquared()>distance*distance);
    }

    });

    return Vector2;
});
