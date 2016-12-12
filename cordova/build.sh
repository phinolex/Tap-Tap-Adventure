export ANDROID_HOME=/media/ubuntu/b2b07394-f5c5-48fa-9bea-7961c9317a3d/android-sdk-linux 

rm -r www
mkdir www
cp -r ../client/* www

rm ./platforms/android/build/outputs/apk/*.apk

cordova build android --release

# jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tta.keystore ./platforms/android/build/outputs/apk/android-x86-release-unsigned.apk TapTapAdventure
# jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tta.keystore ./platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk TapTapAdventure

# cd ./platforms/android/build/outputs/apk

# cp android-x86-release-unsigned.apk taptapadventure-x86.apk
# cp android-armv7-release-unsigned.apk taptapadventure-armv7.apk

# zipalign -f 4 android-x86-release-unsigned.apk taptapadventure-x86.apk
# zipalign -f 4 android-armv7-release-unsigned.apk taptapadventure-armv7.apk

# zipalign -c 4 taptapadventure-x86.apk
# zipalign -c 4 taptapadventure-armv7.apk

jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore tta.keystore ./platforms/android/build/outputs/apk/android-release-unsigned.apk TTA

cd ./platforms/android/build/outputs/apk

cp android-release-unsigned.apk taptapadventure.apk

./zipalign -f 4 android-release-unsigned.apk taptapadventure.apk

./zipalign -c 4 taptapadventure.apk

