/**
 * Created by python on 18-12-25.
 */
$(function () {
    function getCookie(name) {
        var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
        return r ? r[1] : undefined;
        }

    var $login_out = $('#login_out')
    $login_out.click(function () {
        $.ajax({
            url: "/zc_register/login_out",
        type: "post",
        contentType: "application/json",
        headers: {
            "X-CSRFToken": getCookie("csrf_token")
        }
        }).done(function (reps) {
            location.reload()
        })
    })
         //initial
    var w = c.width = window.innerWidth,
        h = c.height = window.innerHeight,
        ctx = c.getContext('2d'),

        //parameters
        total = (w/8)|0,
        accelleration = .05,
        lineAlpha = .02,
        range = 25,

        //afterinitial calculations
        size = w/total,
        occupation = w/total,
        repaintColor = 'rgba(0, 0, 0, .04)'
        colors = [],
        dots = [],
        dotsVel = [];

    //setting the colors' hue
    //and y level for all dots
    var portion = 360/total;
    for(var i = 0; i < total; ++i){
      colors[i] = portion * i;

      dots[i] = h;
      dotsVel[i] = 10;
    }

    function anim(){
      window.requestAnimationFrame(anim);

      ctx.fillStyle = repaintColor;
      ctx.fillRect(0, 0, w, h);

      for(var i = 0; i < total; ++i){
        var currentY = dots[i] - 1;
        dots[i] += dotsVel[i] += accelleration;

        for(var j = i+1; j < i+range && j < total; ++j){
          if(Math.abs(dots[i] - dots[j]) <= range*size){
            ctx.strokeStyle = 'hsla(hue, 80%, 50%, alp)'.replace('hue', (colors[i] + colors[j] + 360)/2 - 180).replace('alp', lineAlpha);
            ctx.beginPath();
            ctx.moveTo(i * occupation, dots[i]);
            ctx.lineTo(j * occupation, dots[j]);
            ctx.stroke();
          }
        }

        if(dots[i] > h && Math.random() < .01){
          dots[i] = dotsVel[i] = 0;
        }
      }
    }

    anim();
})