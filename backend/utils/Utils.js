const enums = require('../Enums');

// Check command if is valid.
module.exports.isValidCommand = function (command) {
        return (command.toLowerCase() === enums.IMPORT_COMMANDS.TRIP || command.toLowerCase() === enums.IMPORT_COMMANDS.DRIVER);
}

// Get command from the text line.
module.exports.getCommandFromText = function (text) {
        return /(?:^|(?:[.!?]\s))(\w+)/.exec(text)[0];
}


// Helper function to get driver name from the line of text.
module.exports.getDriversNameFromText = function (text) {
        return /((?<=\s).*?(?=(?:\d+|$)))/.exec(text)[0].trim();
}


// Helper function to process travel start time, end time, distance. Distance per hour.
module.exports.processTrip = function (text) {
        const tripTime = text.match(/(([0-1]?[0-9]|2[0-3]):[0-5][0-9])/ig);
        // console.log(/(?<!\:)(\d+\.?\d+(?!\:))/.exec(text))
        const stringDistance = /(?<!\:)(\d+\.?\d+(?!\:))/.exec(text)[0];
        const trip = {
                startTime:  tripTime[0],
                endTime: tripTime[1],
                distance: parseFloat(stringDistance)
        }

        // Check if travel time has a start time and end time. Then calculate total trave time.
        if (tripTime.length >= 2) {
                const startTime = exports.timeStringToMinutes(tripTime[0]); 
                const endTime = exports.timeStringToMinutes(tripTime[1]);
                const time = (startTime > endTime) ? (((endTime + 1440) - startTime) / 60) : ((endTime - startTime) / 60);
                const speed =  Math.round((trip.distance / time) * 100) / 100;

                return { ...trip, time, speed };
        }
}

// Convert time string to minutes.
module.exports.timeStringToMinutes = function(timeString) {
        const timeSplit = timeString.split(':');
        return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
}

