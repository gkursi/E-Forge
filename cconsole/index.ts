module.exports.warn = function _l(text, location) {
        console.log(
            "[%cWARN%c] %cA warning was produced at %s: \n%c%s",
            "color: rgb(189, 103, 11);",
            "", "color: rgb(245, 166, 81);",
            location, "color: rgb(235, 209, 181);", 
            text
            )
    }
module.exports.info = function _l(text, location) {
        console.log(
            "[%cWARN%c] %cInfo from %s: \n%c%s",
            "color: rgb(60, 127, 166);",
            "", "color: rgb(60, 166, 122);",
            location, "color: rgb(235, 209, 181);", 
            text
            )
    }
    

    

