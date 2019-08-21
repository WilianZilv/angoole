const serp = require('serp')

module.exports = async search =>
    serp.search({
        host: 'google.pt',
        qs: {
            q: search,
            filter: 0,
            pws: 0,
            safe: 'active'
        },
        num: 15
    })
