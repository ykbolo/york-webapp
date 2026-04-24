const { CheerioCrawler, log } = require('crawlee');
const pLimit = require('p-limit');

/**
 * AI Hotspot Crawler Framework
 * BaseScraper: Template for all site-specific scrapers
 */
class BaseScraper {
  constructor(name, config = {}) {
    this.name = name;
    this.startUrls = config.startUrls || [];
    this.config = config;
  }

  // Override this in child classes
  async parse(context) {
    throw new Error('Scraper must implement parse method');
  }

  async run() {
    log.info(`[${this.name}] Starting crawl...`);
    const crawler = new CheerioCrawler({
      requestHandler: async (context) => {
        return this.parse(context);
      },
      ...this.config.crawlerOptions
    });

    await crawler.run(this.startUrls);
    log.info(`[${this.name}] Finished.`);
  }
}

/**
 * CrawlerManager: Orchestrates multiple scrapers
 */
class CrawlerManager {
  constructor() {
    this.scrapers = [];
    this.results = [];
  }

  addScraper(scraper) {
    this.scrapers.push(scraper);
  }

  async runAll() {
    log.info('Starting all crawlers...');
    const limit = pLimit(1); // Use sequential execution to avoid Crawlee storage conflicts in simple scripts
    
    const tasks = this.scrapers.map(scraper => limit(async () => {
      try {
        log.info(`[Manager] Executing ${scraper.name}...`);
        await scraper.run();
      } catch (err) {
        log.error(`[Manager] Error in scraper ${scraper.name}: ${err.message}`);
      }
    }));

    await Promise.all(tasks);
    log.info('All crawlers completed.');
  }
}

module.exports = { BaseScraper, CrawlerManager };
