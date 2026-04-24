const { BaseScraper } = require('../engine');

class HackerNewsAIScraper extends BaseScraper {
  constructor(pipeline) {
    super('HackerNewsAI', {
      startUrls: ['https://news.ycombinator.com/active'], 
      crawlerOptions: {
        maxRequestsPerCrawl: 10,
      }
    });
    this.pipeline = pipeline;
  }

  async parse({ $, request }) {
    const items = [];
    $('.athing').each((i, el) => {
      const title = $(el).find('.titleline > a').text();
      const link = $(el).find('.titleline > a').attr('href');
      const id = $(el).attr('id');
      
      // Simple AI keyword filter
      const aiKeywords = ['ai', 'llm', 'gpt', 'neural', 'machine learning', 'openai', 'deepseek', 'claude'];
      const isAI = aiKeywords.some(key => title.toLowerCase().includes(key));

      if (isAI) {
        items.push({
          id,
          title,
          link,
          source: 'HackerNews',
          scrapedAt: new Date().toISOString()
        });
      }
    });

    log.info(`[HackerNewsAI] Found ${items.length} AI related items`);
    
    if (this.pipeline) {
      await this.pipeline.saveItems(items);
    }
    
    return items;
  }
}

module.exports = HackerNewsAIScraper;
