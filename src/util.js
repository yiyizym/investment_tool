export default {
    getMonthsElapsed(start, end){
        if(!start){
            return 0;
        }
        let yearsElapsed = end.getFullYear() - start.getFullYear();
        let monthsElapsed = end.getMonth() - start.getMonth();
        return yearsElapsed * 12 + monthsElapsed;
    }
}