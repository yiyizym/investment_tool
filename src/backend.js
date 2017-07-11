import AV from 'leancloud-storage';
import $ from 'jquery';

const APP_ID = 'H71odW5TA2M5pGOzzvFlDOrh-gzGzoHsz';
const APP_KEY = 'cXSh5ovrmSodyewR3cv4Oowf';

export default {
    init(){
        AV.init({
            appId: APP_ID,
            appKey: APP_KEY
        });
        this._user = new AV.User();
        this._FundHistory = AV.Object.extend('Fund');
    },

    signUp(email, password){
        this._user.setUsername(email);
        this._user.setEmail(email);
        this._user.setPassword(password);
        return this._user.signUp();
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
        var query = new AV.Query(this._FundHistory);
        return query
                    .ascending('boughtDate')
                    .equalTo('dependent', this.getCurrentUser())
                    .find()
                    .then(resp => 
                            (resp.map(obj => 
                                        ({
                                            'id': obj.get('objectId'),
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
                    .ascending('priceToEarning')
                    .find()
                    .then(resp => {
                        return resp.map(obj => 
                            ({
                                'name': obj.get('name'),
                                'code': obj.get('code'),
                                'date': obj.get('date'),
                                'priceToEarningRate': obj.get('priceToEarningRate')
                            })
                        );
                    })
                    .then(candidatesWithRate => {
                        let candidatesWithPrice = this.getPricedCandidates(candidatesWithRate.map(item => item['code']))
                        return {candidatesWithPrice, candidatesWithRate}
                    })
                    .then(this.getmergedCandidates)
                    .catch(resp => {
                        console.log(resp.message)
                        return [];
                    })

    },

    getPricedCandidates(codes){
        var cached = void 0;
        if((cached = this.getFromCache())){
            return cached;
        }
        return Promise.all(codes.map(code => $.ajax({
                                type: 'GET',
                                dataType: 'jsonp',
                                url: `http://yunhq.sse.com.cn:32041/v1/sh1/snap/${code}`
                })))
                .then(results => results.map(result => {
                    return {
                        code: result['code'],
                        date: new Date(String(result['date']).replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
                        price: result['snap'][1]
                    }
                }))
                .then(result => {
                    return this.saveToCache(result);
                });
    },

    getFromCache(){
        let scope = localStorage.getItem('investmentTool');
        if(!scope){
            return void 0;
        }else{
            scope = JSON.parse(scope);
        }
        return scope[`pricedCandidates:${this.todayString()}`];
    },

    saveToCache(pricedCandidates){
        let scope = {};
        scope[`pricedCandidates:${this.todayString()}`] = pricedCandidates;
        localStorage.setItem('investmentTool',JSON.stringify(scope));
        return pricedCandidates;
    },

    getmergedCandidates({candidatesWithPrice, candidatesWithRate}){
        let candidatesWithRateCopy = Object.assign([], candidatesWithRate);
        return candidatesWithRateCopy.map(candidate => {
            let pricedCandidate = candidatesWithPrice.find(item => candidate['code'] == item['code']) || {};
            let price = Number(pricedCandidate['price']) || 0;
            candidate['priceToEarning'] = Number(candidate['priceToEarningRate']) * price
            candidate['earningToPrice'] = 1.0 / candidate['priceToEarning'] * 100;
            candidate['price'] = price;

            return candidate;
        })
    },

    todayString(){
        return (new Date()).toISOString().slice(0,10).replace(/-/g,"");
    },

    createFundHistory(data, suggestedAmount, actualAmount){
        var fundHistory = new (this._FundHistory)();
        fundHistory.set('name', data.name);
        fundHistory.set('code', data.code);
        fundHistory.set('boughtDate', new Date());
        fundHistory.set('suggestedAmount', suggestedAmount);
        fundHistory.set('actualAmount', actualAmount);
        fundHistory.set('price', data.price);
        fundHistory.set('dependent', this.getCurrentUser());

        var acl = new AV.ACL();
        acl.setReadAccess(AV.User.current(),true);
        acl.setWriteAccess(AV.User.current(),true);
        fundHistory.setACL(acl);
        
        return fundHistory.save();
    },

    deleteFundHistory(id){
        var fundHistory = AV.Object.createWithoutData('Fund', id);
        return fundHistory.destroy();      
    }
}