var AdBuddizRewardedVideoBridge = {
    fetch: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'rewardedvideo_fetch',
            []
        );
    },
    isReadyToShow: function() {
        var successCallback = arguments[0];
        var errorCallback = arguments[1];
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'rewardedvideo_isReadyToShow',
            []
        );
    },
    show: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'rewardedvideo_show',
            []
        );
    },
    setUserId: function(userId, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'rewardedvideo_setUserId',
            [userId]
        ); 
    },
};

var AdBuddizBridge = {
	setLogLevel: function(logLevel, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_setLogLevel',
            [logLevel]
        ); 
    },
	setPublisherKey: function(publisherKey, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_setPublisherKey',
            [publisherKey]
        ); 
    },
    setTestModeActive: function(logLevel, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_setTestModeActive',
            []
        ); 
    },
    cacheAds: function(successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_cacheAds',
            []
        ); 
    },
    isReadyToShowAd: function() {
        var successCallback = arguments[0];
        var errorCallback = arguments[1];
        var args = Array.prototype.slice.call(arguments, 2);
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_isReadyToShowAd',
            args
        );
    },
    showAd: function() {
        var successCallback = arguments[0];
        var errorCallback = arguments[1];
        var args = Array.prototype.slice.call(arguments, 2);
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'interstitial_showAd',
            args
        ); 
    },
    logNative: function(message, successCallback, errorCallback) {
        cordova.exec(
            successCallback,
            errorCallback,
            'AdBuddizBridge',
            'logNative',
            [message]
        ); 
    },
    rewardedVideo: AdBuddizRewardedVideoBridge,
}

module.exports = AdBuddizBridge;