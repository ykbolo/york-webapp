const { BaseScraper } = require('../engine');

class MockAIScraper extends BaseScraper {
  constructor(pipeline) {
    super('MockAI', {
      startUrls: ['https://example.com'], // Dummy URL
    });
    this.pipeline = pipeline;
  }

  async parse({ $, request }) {
    const items = [
      {
        title: '测试热点：AI 智能助手架构演进',
        link: 'https://example.com/ai-arch-' + Date.now(),
        summary: '这是一个由 Mock 爬虫生成的测试数据，证明爬虫框架到数据库的链路已通。',
        source: 'MockSource',
        hotScore: 500,
        category: '技术',
        publishTime: new Date()
      }
    ];

    console.log(`[MockAI] Generated ${items.length} mock items`);
    
    if (this.pipeline) {
      await this.pipeline.saveItems(items);
    }
    
    return items;
  }
}

module.exports = MockAIScraper;
