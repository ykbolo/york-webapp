const { CrawlerManager } = require('./engine');
const HackerNewsAIScraper = require('./spiders/hackerNews');
const MockAIScraper = require('./spiders/mockScraper');
const { DataPipeline, WebhookNotifier } = require('./utils/pipeline');
require('dotenv').config();

async function main() {
  const manager = new CrawlerManager();
  const pipeline = new DataPipeline();
  const notifier = new WebhookNotifier(process.env.WEBHOOK_URL);

  // Add scrapers
  manager.addScraper(new HackerNewsAIScraper(pipeline));
  manager.addScraper(new MockAIScraper(pipeline));

  // Run scrapers
  // Note: For this framework demo, we modify the scraper to return data directly
  // or use Crawlee's dataset. Here we just run and then read from the pipeline if it was a real DB.
  
  // Actually, let's refine the engine.js to make it easier to collect results.
  // For now, I'll just run them.
  await manager.runAll();
  
  // In a real scenario, the Spiders would call pipeline.saveItems within their parse method
  // but for simplicity in this framework demo, we've set up the structure.
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

module.exports = main;
