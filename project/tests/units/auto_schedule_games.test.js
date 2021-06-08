const daysOfTheWeek = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
}



Date.prototype.addDays1 = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


function getDates2(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = new Date(startDate);
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays1(1);
    }
    return dateArray;
}
function findClassDays(daysOfWeek, firstDay, lastDay) {
    let classDays = [];
    let rangeDates = getDates2(new Date(firstDay), new Date(lastDay));
    classDays = rangeDates.filter(f => daysOfWeek.some((d, i) => daysOfTheWeek[d] == f.getDay()));
    return classDays;
}

describe('auto schedule games tests', () => {
    test('check findClassDays function',  () => {
        const daysOfWeek = ["Sunday", "Monday"];
        const firstDay = "2019-12-31";
        const lastDay = "2020-1-10";
        const lst = findClassDays(daysOfWeek, firstDay, lastDay);
        expect(lst.length).toEqual(2);
    });

    test('check getDates function',   () => {
        const startDate = new Date("2020-1-1");
        const stopDate = new Date("2020-1-10");
        const lst = getDates2(startDate, stopDate);
        expect(lst.length).toEqual(10);
    });

});


