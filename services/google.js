const google = require("google-it");

module.exports = async search =>
    google({
        query: search + "&safe=active",
        limit: 10
    });
