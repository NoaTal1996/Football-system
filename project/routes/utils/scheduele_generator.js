const daysOfTheWeek = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
}


function findClassDays(daysOfWeek, firstDay, lastDay) {
    let classDays = [];
    let rangeDates = getDates(new Date(firstDay), new Date(lastDay));
    classDays = rangeDates.filter(f => daysOfWeek.some((d, i) => daysOfTheWeek[d] == f.getDay()));
    return classDays;
}

function getDates(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = new Date(startDate);
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

exports.findClassDays = findClassDays