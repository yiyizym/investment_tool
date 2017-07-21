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
    moveBackTime: 300,
    deleteBackTime: 300,
    sentencePauseTime: 1000
}

class YaType {
    constructor(el, option){
        this.el = document.querySelector(el);
        this.opt = Object.assign({}, defaultOpt, JSON.parse(JSON.stringify(option)));
        this.currentCentenceIndex = 0;        
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
        var self = this,
            strings = self.opt.strings;
        if(self.currentCentenceIndex == strings.length){
            if(self.opt.loop){
                self.currentCentenceIndex = 0;
                self.setCursor();
            }else{
                return;
            }
        }
        switch (self.opt.effect) {
            case 'back':
                self.moveBackCursor();
                break;
            case 'delete':
                self.deleteBackCursor();
                break;
            default:
                self.moveBackCursor();
        }
    }

    moveBackCursor(){
        var self = this;
        if(this.currentCentenceIndex == 0){
            self.typing();
        } else {
            moveBack();
        }

        function moveBack(){
            var arr = self.prevSentence().split('');
            arr.splice(self.cursorPositioin, 0, '<i class="yatype__cursor">|</i>');
            self.el.innerHTML = arr.join('');
            if(self.cursorPositioin != self.getLastSameCharIndex()){
                setTimeout(function(){
                    self.cursorPositioin -= 1
                    moveBack();
                }, self.opt.moveBackTime);
            } else {
                self.typing();
            }

        }
    }

    getLastSameCharIndex(){
        var self = this;
        var prevContent = self.prevSentence();
        var currContent = self.currSentence();
        var lastSameCharIndex = 0;
        while(
                prevContent[lastSameCharIndex] &&
                currContent[lastSameCharIndex] &&
                prevContent[lastSameCharIndex] == currContent[lastSameCharIndex]
            ){
            lastSameCharIndex ++;
        }
        return lastSameCharIndex;
    }

    deleteBackCursor(){
        var self = this;
        if(this.currentCentenceIndex == 0){
            self.deleteTyping();
        } else {
            var prevSentenceCopy = self.prevSentence();
            deleteBack(prevSentenceCopy);
        }

        function deleteBack(sentenceToDelete){
            self.el.innerHTML = sentenceToDelete + '<i class="yatype__cursor">|</i>';
            if(self.cursorPositioin != self.getLastSameCharIndex()){
                setTimeout(function(){
                    self.cursorPositioin -= 1
                    deleteBack(sentenceToDelete.slice(0,sentenceToDelete.length - 1));
                }, self.opt.deleteBackTime);
            } else {
                self.deleteTyping();
            }

        }
    }

    prevSentence(){
        if(this.currentCentenceIndex){
            return this.opt.strings[this.currentCentenceIndex - 1]['content'];
        } else {
            return '';
        }
    }

    currSentence(){
        return this.opt.strings[this.currentCentenceIndex]['content'];
    }

    typing(){
        let index = 0,
            self = this,
            prevContent = this.prevSentence(),
            currContent = this.currSentence(),
            {bPart, mPart, aPart} = this.splitSentence(prevContent, currContent),
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

    deleteTyping(){
        var self = this,
            index = 0, 
            currContent = this.currSentence(),
            chars = currContent.slice(self.getLastSameCharIndex()),
            curStr = currContent.slice(0, self.getLastSameCharIndex());
        function type(){
            if(index == chars.length){
                self.currentCentenceIndex += 1;
                self.walk();
                return;
            }
            curStr += chars[index++];
            self.cursorPositioin = curStr.length;
            self.el.innerHTML = curStr + '<i class="yatype__cursor">|</i>';
            setTimeout(type, self.opt.charTime);
        }

        type();
    }

    moveCursor(bPart,curStr, aPart){
        this.cursorPositioin = bPart.length + curStr.length;
        return bPart + curStr + '<i class="yatype__cursor">|</i>' + aPart;
    }

    splitSentence(prev, current){
        if(!prev){
            return {bPart: '', mPart: current, aPart: ''};
        }
        if(prev == current){
            console.error('two sentence is the same');
            return {bPart: current, mPart: '', aPart: ''};
        }
        let index = this.getLastSameCharIndex();
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
