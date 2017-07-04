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
    signOut(){
        AV.User.logOut();
    },
    getCurrentUser(){
        return AV.User.current();
    },
    resetPassword(email){
        return AV.User.requestPasswordReset(email);
    },
    getFundHistory(){
        let Fund = AV.Object.extend('Fund');
        var query = new AV.Query(Fund);
        return query
                    .ascending('boughtDate')
                    .find()
                    .then(resp => 
                            (resp.map(obj => 
                                        ({
                                            'name': obj.get('name'),
                                            'code': obj.get('code'),
                                            'boughtDate': obj.get('boughtDate'),
                                            'suggestedAmount': obj.get('suggestedAmount'),
                                            'actualAmount': obj.get('actualAmount'),
                                            'price': obj.get('price')
                                        })
                                    )
                            )
                    )
                    .catch(resp => {
                        console.log(resp.message)
                        return [];
                    })
    },

    getCandidates(){
        let Candidate = AV.Object.extend('Candidate');
        var query = new AV.Query(Candidate);
        return query
                    .addDescending('earningToPrice')
                    .find()
                    .then(resp => 
                            (resp.map(obj => 
                                        ({
                                            'name': obj.get('name'),
                                            'code': obj.get('code'),
                                            'date': obj.get('date'),
                                            'earningToPrice': obj.get('earningToPrice'),
                                            'priceToBook': obj.get('priceToBook'),
                                            'dividendYieldRatio': obj.get('dividendYieldRatio'),
                                            'returnOnEquity': obj.get('returnOnEquity')
                                        })
                                    )
                            )
                    )
                    .catch(resp => {
                        console.log(resp.message)
                        return [];
                    })
    }
}