import AV from 'leancloud-storage';

const APP_ID = 'H71odW5TA2M5pGOzzvFlDOrh-gzGzoHsz';
const APP_KEY = 'cXSh5ovrmSodyewR3cv4Oowf';

export default {
    init(){
        AV.init({
            appId: APP_ID,
            appKey: APP_KEY
        });
        this._user = new AV.User();
    },

    signUp(email, password){
        this._user.setUsername(email);
        this._user.setEmail(email);
        this._user.setPassword(password);
        return this._user.signUp();
        // .then(function (loginedUser) {
        // }, (function (error) {
        //     alert(JSON.stringify(error));
        // }));
    },
    signIn(username, password){
        return AV.User.logIn(username, password);
    },
    currentUser(){
        return this._user;
    },
    test(){
        let TestObject = AV.Object.extend('TestObject');
        let testObject = new TestObject();
        return testObject.save({
          words: 'Hello World!'
        });
        // .then(function(object) {
        //   alert('LeanCloud Rocks!');
        // })
    }
}