cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.purplebrain.adbuddiz.sdk/www/adbuddizbridge.js",
        "id": "com.purplebrain.adbuddiz.sdk.AdBuddizBridge"
    },
    {
        "file": "plugins/com.purplebrain.adbuddiz.sdk/www/adbuddiz.js",
        "id": "com.purplebrain.adbuddiz.sdk.AdBuddiz",
        "clobbers": [
            "adbuddiz"
        ]
    },
    {
        "file": "plugins/cordova-plugin-ad-unityads/www/unityads.js",
        "id": "cordova-plugin-ad-unityads.unityads",
        "clobbers": [
            "window.unityads"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-crosswalk-webview": "2.0.0",
    "cordova-plugin-device": "1.1.4",
    "com.purplebrain.adbuddiz.sdk": "3.1.11",
    "cordova-plugin-ad-unityads-sdk": "1.0.3",
    "cordova-plugin-ad-unityads": "1.0.35"
};
// BOTTOM OF METADATA
});