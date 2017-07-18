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
    charTime: 600,
    moveBackTime: 500,
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
                css = [
                    '.yatype__cursor {',
                        'color: black;',
                        'font-weight: bolder;',
                        'font-style: normal;',
                        'animation: 1s flashing step-end infinite;',
                        '}',
                    '@keyframes flashing {',
                        '0%, 100% {',
                            'color: black;',
                        '}',
                        '50% {',
                            'color: transparent',
                        '}',
                    '}'].join('\n');
                
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
        this.currentCentenceIndex = this.currentCentenceIndex || 0;
        this.cursorPositioin = this.cursorPositioin || 0;
        let strings = this.opt.strings;
        if(this.currentCentenceIndex == strings.length){
            if(this.opt.loop){
                this.currentCentenceIndex = 0;
                this.setCursor();
            }else{
                return;
            }
        }
        this.moveBackCursor(this.currentCentenceIndex, this.typing.bind(this));
    }

    moveBackCursor(centenceIndex, callback){
        var self = this;
        if(centenceIndex == 0){
            callback(this.opt.strings[centenceIndex]['content']);
        } else {
            var prevContent = this.opt.strings[centenceIndex - 1]['content'];
            var currContent = this.opt.strings[centenceIndex]['content'];
            var lastSameCharIndex = 0;
            while(prevContent[lastSameCharIndex] == currContent[lastSameCharIndex]){
                lastSameCharIndex ++;
            }
            moveBack(lastSameCharIndex, prevContent.length);
        }

        function moveBack(lastIndex, currIndex){
            var arr = prevContent.split('');
            arr.splice(currIndex, 0, '<i class="yatype__cursor">|</i>');
            self.el.innerHTML = arr.join('');
            if(currIndex != lastIndex){
                setTimeout(function(){
                    moveBack(lastIndex, currIndex - 1);
                }, self.opt.moveBackTime);
            } else {
                callback.call(self,self.opt.strings[centenceIndex]['content']);
            }

        }
    }

    typing(content){
        let index = 0,
            self = this,
            prevContent = this.getPrevContent(),
            {bPart, mPart, aPart} = this.splitSentence(prevContent, content),
            chars = mPart.split(''),
            curStr = '';
        function type(){
            if(index == chars.length){
                self.currentCentenceIndex += 1;
                self.walk();
                return;
            }
            curStr += chars[index++];
            self.el.innerHTML = self.moveCursor(bPart,curStr, aPart);
            setTimeout(type, self.opt.charTime);
        }

        type();
    }

    getPrevContent(){
        return this.currentCentenceIndex && this.opt.strings[this.currentCentenceIndex-1]['content'] || '';
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
