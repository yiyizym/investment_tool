<template>
    <section>
        <div>
            <div class="typing"></div>
        </div>
        <el-button @click="handleTry" type="primary">试用</el-button>
    </section>
</template>
<script>

const defaultOpt = {
    loop: true,
    sentenceTime: 3000,
    sentencePauseTime: 1000
}

class YaType {
    constructor(el, option){
        this.el = document.querySelector(el);
        this.opt = Object.assign({}, defaultOpt, JSON.parse(JSON.stringify(option)));
        this.setCursor();
        this.walk();
    }

    setCursor(){
        this.cursorPositioin = 0;
        this.el.innerHTML = '<i class="yatype__cursor">|</i>';
        this.cursorStyle = document.querySelector('style[name="yatype"]') || generateStyle();

        function generateStyle(){
            let style = document.createElement('style'),
                css = '.yatype__cursor { \
                        color: black;\
                        font-weight: bolder;\
                        font-style: normal;\
                        animation: flashing 0.5s steps(2) infinite; \
                    } \
                    @keyframes flashing { \
                        0% { \
                            opacity: 0; \
                        };\
                        100% {\
                            opacity: 1;\
                        }\
                    }';
                
            style.setAttribute('name', 'yatype');
            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            document.head.appendChild(style);
        }
    }

    walk(){
        this.currentIndex = this.currentIndex || 0;
        this.cursorPositioin = this.cursorPositioin || 0;
        let strings = this.opt.strings;
        if(this.currentIndex == strings.length){
            if(this.opt.loop){
                this.currentIndex = 0;
                this.setCursor();
            }else{
                return;
            }
        }
        this.typing(strings[this.currentIndex]['content']);
        this.currentIndex += 1;
        setTimeout(_ => {
            this.walk();
        }, this.opt.sentenceTime + this.opt.sentencePauseTime);
    }

    typing(content){
        let index = 0,
            self = this,
            prevContent = this.getPrevContent(),
            {bPart, mPart, aPart} = this.splitSentence(prevContent, content),
            chars = mPart.split(''),
            charTime = this.opt.sentenceTime / chars.length,
            curStr = '';
        function type(){
            if(index == chars.length){
                return;
            }
            curStr += chars[index++];
            self.el.innerHTML = self.moveCursor(bPart,curStr, aPart);
            setTimeout(type, charTime);
        }

        type();
    }

    getPrevContent(){
        return this.currentIndex && this.opt.strings[this.currentIndex-1]['content'] || '';
    }

    moveCursor(bPart,curStr, aPart){
        return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
    }

    splitSentence(prev, current){
        if(!prev){
            return {bPart: '', mPart: current, aPart: ''};
        }
        let index = 0;
        while(prev[index] == current[index]){
            index++;
        }
        let bPart = prev.slice(0, index);
        let aPart = prev.slice(index, prev.length);
        let inverseIndex = current.lastIndexOf(aPart);
        let mPart = current.slice(index, inverseIndex);
        
        return {bPart,mPart,aPart}
    }
}

let option = {
    strings: [
        {content: '这是一款定投工具'},
        {content: '这是一款 ETF 基金定投工具', effects: [{type: 'insert'}]},
        {content: '这是一款不太专业的 ETF 基金定投工具', effects: [{type: 'insert'}]}
    ]
}

export default {
    mounted() {
        new YaType('.typing', option);
    },
    methods: {
        handleTry() {
            this.$emit('tryToUse')
        }
    }
}
</script>
<style>

</style>
