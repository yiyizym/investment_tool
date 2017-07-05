export default {
    getMonthsElapsed(start, end){
        let yearsElapsed = end.getFullYear() - start.getFullYear();
        let monthsElapsed = end.getMonth() - start.getMonth();
        return yearsElapsed * 12 + monthsElapsed;
    }
}