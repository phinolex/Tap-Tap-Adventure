define(function(){
    var Button = Class.extend({
        init: function(x, y, w, h, bgimageurl){
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        },
        isClicked: function(clickedX, clickedY){
            if(clickedX > this.x && clickedX < this.x + this.w  && clickedY > this.y && clickedY < this.y + this.h) {
                return true;
            }
            return false;
        },
    });
});
