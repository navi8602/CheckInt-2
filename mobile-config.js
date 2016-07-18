App.info({
    id:"com.checkInt.mobillan",
    buildNumber: "004",
    version: "0.0.4",
    name: 'CheckInt',
    description: 'CheckInt project.',
    author: 'Goncharov Viktor',
    email: 'navi8602@gmail.com',
    website: 'http://46.101.103.94'
});


App.setPreference('AutoHideSplashScreen' ,'false');
App.setPreference('BackupWebStorage' ,'local');
App.setPreference('HideKeyboardFormAccessoryBar', 'true');
App.setPreference('DisallowOverscroll', 'true');
App.setPreference('SplashScreen', 'screen');
App.setPreference('Fullscreen', 'true');

App.setPreference('KeyboardDisplayRequiresUserAction', 'false');

//App.accessRule("blob:*");
App.accessRule('http://46.101.103.94/*')
