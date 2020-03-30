const google = require("./lib");

module.exports = async search =>
    google({
        query: search + "&safe=active",
        limit: 10
    });
