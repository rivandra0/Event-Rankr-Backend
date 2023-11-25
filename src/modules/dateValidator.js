function isDateStringValid(dateString) {
    try {
        // Attempt to create a Date object from the string
        new Date(dateString);
        return true; // If successful, the string is valid
    } catch (e) {
        return false; // If an error occurs, the string is not valid
    }
}

export { isDateStringValid }