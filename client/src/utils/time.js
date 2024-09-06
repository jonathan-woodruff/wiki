const getMonthName = (monthNumber) => {
    switch (monthNumber) {
        case 1: return 'Jan';
        case 2: return 'Feb';
        case 3: return 'Mar';
        case 4: return 'Apr';
        case 5: return 'May';
        case 6: return 'Jun';
        case 7: return 'Jul';
        case 8: return 'Aug';
        case 9: return 'Sep';
        case 10: return 'Oct';
        case 11: return 'Nov';
        case 12: return 'Dec';
        default: return 'Unknown Month'
    };
};

export const convertTimestamp = (timestamp) => {
    const newDate = new Date(timestamp);
    return `${getMonthName(newDate.getMonth() + 1)} ${newDate.getDate()}, ${newDate.getFullYear()}`;
};