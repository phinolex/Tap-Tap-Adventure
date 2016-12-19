var bridge = cordova.require("com.purplebrain.adbuddiz.sdk.AdBuddizBridge");

var fallbackDelegate = null;
var fallbackRewardedVideoDelegate = null;

var adBuddizDelegateCallback = function(sEventToDispatch) {
	if(sEventToDispatch == null || sEventToDispatch == undefined) {
		return;
	} else if(sEventToDispatch == "OK") {
		return;
	} else {
		var eventToDispatch = sEventToDispatch.split(":");
		var detail = null;
		if(eventToDispatch.length > 1)
			detail = eventToDispatch[1];
		try {
			var customDelegateEvent = document.createEvent('CustomEvent');
			customDelegateEvent.initCustomEvent(eventToDispatch[0], true, true, detail);
			document.dispatchEvent(customDelegateEvent);
		} catch(ex) {
			switch(eventToDispatch[0]) {
				case "AB-didCacheAd":
					if (fallbackDelegate != null) fallbackDelegate.didCacheAd();
					break;
				case "AB-didShowAd":
					if (fallbackDelegate != null) fallbackDelegate.didShowAd();
					break;
				case "AB-didFailToShowAd":
					if (fallbackDelegate != null) fallbackDelegate.didFailToShowAd(detail);
					break;
				case "AB-didClick":
					if (fallbackDelegate != null) fallbackDelegate.didClick();
					break;
				case "AB-didHideAd":
					if (fallbackDelegate != null) fallbackDelegate.didHideAd();
					break;
				case "AB-RewardedVideo-didFetch":
					if (fallbackRewardedVideoDelegate != null) fallbackRewardedVideoDelegate.didFetch();
					break;
				case "AB-RewardedVideo-didFail":
					if (fallbackRewardedVideoDelegate != null) fallbackRewardedVideoDelegate.didFail(detail);
					break;
				case "AB-RewardedVideo-didComplete":
					if (fallbackRewardedVideoDelegate != null) fallbackRewardedVideoDelegate.didComplete();
					break;
				case "AB-RewardedVideo-didNotComplete":
					if (fallbackRewardedVideoDelegate != null) fallbackRewardedVideoDelegate.didNotComplete();
					break;
			}
		}
        
	}
}

var AdBuddizRewardedVideo = {
	fetch: function() {
		bridge.rewardedVideo.fetch(adBuddizDelegateCallback, null);
	},
	isReadyToShow: function() {
		var trueCallback = null;
		var falseCallback = null;
		switch (arguments.length) {
			case 1:
				trueCallback = arguments[0];
				break;
			case 2:
				trueCallback = arguments[0];
				falseCallback = arguments[1];
				break;
			default:
				return;
		}
		var successCallback = function(messageOrEventToDispatch) {
			if(messageOrEventToDispatch == "true") {
				trueCallback();
			} else if(messageOrEventToDispatch == "false") {
				if(falseCallback != null)
					falseCallback();
			} else {
				adBuddizDelegateCallback(messageOrEventToDispatch);
			}
		};
		bridge.rewardedVideo.isReadyToShow(successCallback, null);
	},
	show: function() {
		bridge.rewardedVideo.show(adBuddizDelegateCallback, null);
	},
	setUserId: function(userId) {
		bridge.rewardedVideo.setUserId(userId, adBuddizDelegateCallback, null);
	},
	setDelegate: function(delegate) {
		fallbackIncentivizedDelegate = delegate;
	},
}

var AdBuddiz = {
	setLogLevel: function(logLevel) {
		bridge.setLogLevel(logLevel, adBuddizDelegateCallback, null);
	},
	setIOSPublisherKey: function(publisherKey) {
		if(window.device.platform == "iOS") {
			bridge.setPublisherKey(publisherKey, adBuddizDelegateCallback, null);
		}
	},
	setAndroidPublisherKey: function(publisherKey) {
		if(window.device.platform == "Android") {
			bridge.setPublisherKey(publisherKey, adBuddizDelegateCallback, null);
		}
	},
	setTestModeActive: function() {
		bridge.setTestModeActive(adBuddizDelegateCallback, null);
	},
	cacheAds: function() {
		bridge.cacheAds(adBuddizDelegateCallback, null);
	},
	isReadyToShowAd: function() {
		var placement = null;
		var trueCallback = null;
		var falseCallback = null;
		switch (arguments.length) {
			case 1:
				trueCallback = arguments[0];
				break;
			case 2:
				if (typeof arguments[0] === "string" || arguments[0] instanceof String) {
					placement = arguments[0];
					trueCallback = arguments[1];
				} else {
					trueCallback = arguments[0];
					falseCallback = arguments[1];
				}
				break;
			case 3:
				placement = arguments[0];
				trueCallback = arguments[1];
				falseCallback = arguments[2];
				break;
			default:
				return;
		}
		var successCallback = function(messageOrEventToDispatch) {
			if(messageOrEventToDispatch == "true") {
				trueCallback();
			} else if(messageOrEventToDispatch == "false") {
				if(falseCallback != null)
					falseCallback();
			} else {
				adBuddizDelegateCallback(messageOrEventToDispatch);
			}
		};
		if(arguments.length > 0) {
			bridge.isReadyToShowAd(successCallback, null, arguments[0]);
		} else {
			bridge.isReadyToShowAd(successCallback, null);
		}
	},
	showAd: function() {
		if(arguments.length > 0) {
			bridge.showAd(adBuddizDelegateCallback, null, arguments[0])
		} else {
			bridge.showAd(adBuddizDelegateCallback, null);
		}
	},
	setDelegate: function(delegate) {
		fallbackDelegate = delegate;
	},
	LogLevel: {
		Info: "Info",
		Error: "Error",
		Silent: "Silent"
	},
	rewardedVideo: AdBuddizRewardedVideo,
};

module.exports = AdBuddiz;