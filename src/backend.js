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
        this._Fund = AV.Object.extend('Fund');
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
        var query = new AV.Query(this._Fund);
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
    },

    buy(data, suggestedAmount, actualAmount){
        var fund = new (this._Fund)();
        fund.set('name', data.name);
        fund.set('code', data.code);
        fund.set('boughtDate', new Date());
        fund.set('suggestedAmount', suggestedAmount);
        fund.set('actualAmount', actualAmount);
        fund.set('price', data.price);
        return fund.save();
        // .then(function (fund) {
        //     // 成功保存之后，执行其他逻辑.
        //     console.log('New object created with objectId: ' + fund.id);
        // }, function (error) {
        //     // 异常处理
        //     console.error('Failed to create new object, with error message: ' + error.message);
        // });
    }
}