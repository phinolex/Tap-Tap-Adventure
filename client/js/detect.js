
var Detect = {};

Detect.supportsWebSocket = function() {
    return window.WebSocket || window.MozWebSocket;
};

Detect.userAgentContains = function(string) {
    return navigator.userAgent.indexOf(string) != -1;
};

Detect.isTablet = function(screenWidth) {
    if(screenWidth > 720) {
        if(Detect.userAgentContains('Android')
        || Detect.userAgentContains('Mobile') || Detect.userAgentContains('iPad')) {
            return true;
        }
    }
    return false;
};

Detect.isWindows = function() {
    return Detect.userAgentContains('Windows');
}

Detect.isChromeOnWindows = function() {
    return Detect.userAgentContains('Chrome') && Detect.userAgentContains('Windows');
};

Detect.isCanaryOnWindows = function() {
    return Detect.userAgentContains('Chrome/52') && Detect.userAgentContains('Windows');
};

Detect.isEdgeOnWindows = function() {
    return Detect.userAgentContains('Edge') && Detect.userAgentContains('Windows');
};


Detect.isFirefox = function() {
    //alert("useragent="+navigator.userAgent);
    return Detect.userAgentContains('Firefox');
};

Detect.canPlayMP3 = function() {
    return Modernizr.audio.mp3;
};

Detect.isSafari = function() {
    return Detect.userAgentContains('Safari') && !Detect.userAgentContains('Chrome');
};

Detect.isOpera = function() {
    return Detect.userAgentContains('Opera');
};

Detect.isFirefoxAndroid = function() {
    return Detect.userAgentContains('Android') && Detect.userAgentContains('Firefox');
};
