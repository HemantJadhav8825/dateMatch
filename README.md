#android
cd android
./gradlew clean
cd ..
npx react-native run-android


#ios
cd ios
pod install
cd ..
npx react-native run-ios



#wipe everything

npx react-native-clean-project
# or manually:
watchman watch-del-all
rm -rf node_modules
rm -rf /tmp/metro-*
rm -rf ios/Pods ios/Podfile.lock
npm install
cd ios && pod install && cd ..
npx react-native run-ios


#release apk
cd android
./gradlew clean
./gradlew assembleRelease

android/app/build/outputs/apk/release/app-release.apk
