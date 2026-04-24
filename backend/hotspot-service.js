const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.HOTSPOT_PORT || 3006;

app.use(cors());
app.use(express.json());

/**
 * @api {get} /api/hotspots 获取AI热点列表 (分页)
 * @param {Number} page 页码 (默认1)
 * @param {Number} pageSize 每页数量 (默认10)
 */
app.get('/api/hotspots', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const [rows] = await pool.execute(
      'SELECT * FROM hotspots ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [pageSize.toString(), offset.toString()]
    );

    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM hotspots');

    res.json({
      code: 200,
      data: {
        list: rows,
        pagination: {
          total,
          page,
          pageSize
        }
      }
    });
  } catch (err) {
    console.error('Hotspot Service Error:', err);
    res.status(500).json({ code: 500, message: 'Internal Server Error' });
  }
});

/**
 * @api {get} /api/hotspots/stats 获取热点统计信息
 */
app.get('/api/hotspots/stats', async (req, res) => {
  try {
    const [stats] = await pool.execute(
      'SELECT category, COUNT(*) as count FROM hotspots GROUP BY category'
    );
    res.json({ code: 200, data: stats });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 AI Hotspot Service running at http://localhost:${port}`);
});
