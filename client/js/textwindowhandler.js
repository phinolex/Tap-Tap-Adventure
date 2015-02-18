
define(['jquery'], function() {
    var TextWindowHandler = Class.extend({
        init: function(){
            this.self = this;
            this.textWindowOn = true;
            this.textWindow = $('#textWindow');

            var text = '<p><h4>Welcome to Tap Tap Adventure</h4></p>'
                     + '<p><h3></h3></p>'
                     + '<p>Latest News: Tweaks and Inventory</p>'
                     + '<p>Agent quest is now available</p>'
            $('#textWindow').html(text);
            $('#textWindow').fadeIn('fast');
        },
        toggleTextWindow: function(){
            if(this.textWindowOn){
                this.textWindowOn = false;
                $('#textWindow').fadeOut('fast');
                $('#helpbutton').removeClass('active');
            } else{
                this.textWindowOn = true;
                $('#textWindow').fadeIn('fast');
                $('#helpbutton').addClass('active');
            }
        },
        setHtml: function(html){
            $('#textWindow').html(html);
        },
        close: function(){
            this.textWindowOn = false;
            $('#textWindow').fadeOut('fast');
            $('#helpbutton').removeClass('active');
        }
    });

    return TextWindowHandler;
});
