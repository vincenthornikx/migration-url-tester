module.exports = new class Sitemap {
    parse(data) {
        return data
            .match(/<loc>([^<]+)<\/loc>/g)
            .map(url => url.replace('<loc>', '').replace('</loc>', ''));
    }
}
