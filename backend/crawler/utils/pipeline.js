const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

class DataPipeline {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'york_password_2026',
      database: process.env.DB_NAME || 'hotspot_db',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async saveItems(items) {
    if (!items || items.length === 0) return;

    const newItems = [];
    for (const item of items) {
      try {
        // Use INSERT IGNORE or ON DUPLICATE KEY UPDATE to handle duplicates
        const [result] = await this.pool.execute(
          `INSERT IGNORE INTO hotspots (title, link, summary, source, hot_score, category, publish_time) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            item.title, 
            item.link, 
            item.summary || '', 
            item.source || 'Unknown', 
            item.hotScore || 0, 
            item.category || 'General',
            item.publishTime || new Date()
          ]
        );

        if (result.affectedRows > 0) {
          newItems.push(item);
        }
      } catch (err) {
        console.error(`[Pipeline] Error saving item: ${item.title}`, err.message);
      }
    }

    if (newItems.length > 0) {
      console.log(`[Pipeline] Saved ${newItems.length} new items to MySQL.`);
    }
    return newItems;
  }

  async close() {
    await this.pool.end();
  }
}

class WebhookNotifier {
  constructor(url) {
    this.url = url;
  }

  async broadcast(items) {
    if (!this.url || !items || items.length === 0) return;

    const content = items.map((item, i) => 
      `${i + 1}. **${item.title}**\n   🔗 [查看详情](${item.link})`
    ).join('\n\n');

    const payload = {
      msg_type: "markdown",
      content: {
        title: "🤖 AI 热点新发现",
        text: `发现 ${items.length} 条新的 AI 动态：\n\n${content}`
      }
    };

    try {
      await axios.post(this.url, payload);
      console.log('[Webhook] Broadcast sent successfully.');
    } catch (err) {
      console.error('[Webhook] Failed to send:', err.message);
    }
  }
}

module.exports = { DataPipeline, WebhookNotifier };
