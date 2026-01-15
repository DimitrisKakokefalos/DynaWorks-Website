const markdownIt = require('markdown-it');

module.exports = function(eleventyConfig) {
    
    const md = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });
    eleventyConfig.setLibrary('md', md);
    
    eleventyConfig.addPassthroughCopy("src/assets");
    eleventyConfig.addPassthroughCopy("src/carousel-assets");
    eleventyConfig.addPassthroughCopy("src/styles");
    eleventyConfig.addPassthroughCopy("src/responsiveness");
    eleventyConfig.addPassthroughCopy("src/GDPR");
    eleventyConfig.addPassthroughCopy("src/pages");
    eleventyConfig.addPassthroughCopy("src/.well-known");
    eleventyConfig.addPassthroughCopy("src/manifest.json");
    eleventyConfig.addPassthroughCopy("src/robots.txt");
    eleventyConfig.addPassthroughCopy("src/sitemap.xml");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/netlify/functions");
    
    eleventyConfig.addCollection("posts", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/posts/*.md").sort((a, b) => {
            return b.date - a.date;
        });
    });
    
    eleventyConfig.addFilter("dateDisplay", (date) => {
        return new Date(date).toLocaleDateString('el-GR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });
    
    eleventyConfig.addFilter("dateISO", (date) => {
        return new Date(date).toISOString();
    });
    
    eleventyConfig.addFilter("readingTime", (content) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes === 1 ? '1 λεπτό' : `${minutes} λεπτά`;
    });
    
    eleventyConfig.addFilter("excerpt", (content) => {
        const plainText = content.replace(/<[^>]*>/g, '');
        return plainText.substring(0, 160) + '...';
    });
    
    eleventyConfig.addFilter("head", (array, n) => {
        if (!Array.isArray(array)) return [];
        return array.slice(0, n);
    });

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
    
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        templateFormats: ["njk", "md", "html"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};