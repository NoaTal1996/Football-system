const scheduele_generator = require("../../routes/utils/scheduele_generator");
const DButils = require("../../routes/utils/DButils");
jest.setTimeout(10000000);

describe('auto schedule games tests', () => {
    test('check findClassDays function', async () => {
        const daysOfWeek = ["Sunday", "Monday"];
        const firstDay = "2019-12-31";
        const lastDay = "2020-1-10";
        const lst = scheduele_generator.findClassDays(daysOfWeek, firstDay, lastDay);
        expect(lst.length).toBe(2);
    });
    test('check getDates function', async () => {
        const startDate = new Date("2020-1-1");
        const stopDate = new Date("2020-1-10");
        const lst = scheduele_generator.getDates(startDate, stopDate);
        expect(lst.length).toBe(10);
    });
});
