const { getSumFromArray } = require('../sum-util');

describe('sum-util', () => {

    describe('get sum from array', () => {

        it('calculates a sum from an array of numbers', () => {
            const numArray = [1, 2, 3, 4, 5];
            expect(getSumFromArray(...numArray)).toEqual(15);
        });

        it('calculates a sum from an array of 1 number', () => {
            const numArray = [5];
            expect(getSumFromArray(...numArray)).toEqual(5);
        });
        
    });
});