//returns true if the input arrays are exactly the same
export const arraysAreEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

//returns a string in title case (it simply capitalizes the first letter of every word)
export const toTitleCase = (title) => {
    return title 
    ? title.split(' ')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join(' ')
    : '';
};