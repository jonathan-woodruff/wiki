//returns true if the input arrays are exactly the same
export const arraysAreEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};