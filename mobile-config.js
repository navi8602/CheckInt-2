App.info({
    id:"com.checkInt.mobillan",
    buildNumber: "777",
    version: "7.7.7",
    name: 'CheckInt',
    description: 'CheckInt project.',
    author: 'Goncharov Viktor',
    email: 'navi8602@gmail.com',
    website: 'http://45.55.69.127'
});



App.icons({
    'iphone_2x': 'resources/ios/icon/icon-60@2x.png',
    'iphone_3x': 'resources/ios/icon/icon-60@3x.png',
    'ipad': 'resources/ios/icon/icon-76.png',
    'ipad_2x': 'resources/ios/icon/icon-76@2x.png'
});

App.launchScreens({
    'iphone_2x': 'resources/ios/splash/Default@2x~iphone.png',
    'iphone5': 'resources/ios/splash/Default-568h@2x~iphone.png',
    'iphone6': 'resources/ios/splash/Default-667h.png',
    'ipad_landscape': 'resources/ios/splash/Default-Landscape~ipad.png',
    'ipad_portrait_2x': 'resources/ios/splash/Default-Portrait@2x~ipad.png',
    'ipad_portrait': 'resources/ios/splash/Default-Portrait~ipad.png'

});


App.setPreference('AutoHideSplashScreen' ,'false');
App.setPreference('BackupWebStorage' ,'local');
App.setPreference('HideKeyboardFormAccessoryBar', 'true');
App.setPreference('DisallowOverscroll', 'true');
App.setPreference('SplashScreen', 'screen');
App.setPreference('SplashScreenDelay', '10000');
App.setPreference('Fullscreen', 'true');

App.setPreference('KeyboardDisplayRequiresUserAction', 'false');

App.accessRule("blob:*");
App.accessRule('http://45.55.69.127/*');
