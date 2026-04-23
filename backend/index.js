const express = require('express');
const cors = require('cors');
const moment = require('moment');
const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

const mockEvents = [
  {
    esid: 'tt-1',
    event_name: 'WTT 新加坡大满贯赛 2024',
    classification: '海外赛事',
    event_date: moment().startOf('month').add(5, 'days').valueOf(),
    event_date_format: moment().startOf('month').add(5, 'days').format('YYYY-MM-DD'),
    event_end_time_format: moment().startOf('month').add(12, 'days').format('YYYY-MM-DD'),
    detail: 'WTT新加坡大满贯赛是世界乒联顶尖赛事，汇集全球男女各64名顶尖单打选手和24对双打组合。',
  },
  {
    esid: 'tt-2',
    event_name: '中国乒乓球俱乐部超级联赛 (CTTSL)',
    classification: '国内赛事',
    event_date: moment().startOf('month').add(18, 'days').valueOf(),
    event_date_format: moment().startOf('month').add(18, 'days').format('YYYY-MM-DD'),
    event_end_time_format: moment().startOf('month').add(25, 'days').format('YYYY-MM-DD'),
    detail: '中国乒超联赛是世界上水平最高的乒乓球职业联赛之一，拥有马龙、樊振东等顶尖球星。',
  },
  {
    esid: 'tt-3',
    event_name: '2024 巴黎奥运会乒乓球亚洲区资格赛',
    classification: '海外赛事',
    event_date: moment().startOf('month').add(10, 'days').valueOf(),
    event_date_format: moment().startOf('month').add(10, 'days').format('YYYY-MM-DD'),
    event_end_time_format: moment().startOf('month').add(14, 'days').format('YYYY-MM-DD'),
    detail: '争夺巴黎奥运会单打及团体席位的关键战役，亚洲顶尖高手悉数到场。',
  },
  {
    esid: 'tt-4',
    event_name: 'WTT 冠军赛 仁川站',
    classification: '海外赛事',
    event_date: moment().subtract(5, 'days').valueOf(),
    event_date_format: moment().subtract(5, 'days').format('YYYY-MM-DD'),
    event_end_time_format: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    detail: 'WTT冠军赛系列，仅设单打项目，积分为1000分，是球星们争夺世界排名的重头戏。',
  },
  {
    esid: 'tt-5',
    event_name: '全国青少年乒乓球锦标赛',
    classification: '国内赛事',
    event_date: moment().subtract(2, 'days').valueOf(),
    event_date_format: moment().subtract(2, 'days').format('YYYY-MM-DD'),
    event_end_time_format: moment().add(3, 'days').format('YYYY-MM-DD'),
    detail: '挖掘未来国乒接班人的重要摇篮，汇聚了全国最优秀的青少年选手。',
  }
];

app.get('/api/calendar/events', (req, res) => {
  res.json({
    code: 0,
    obj: {
      eventList: mockEvents
    }
  });
});

app.listen(port, () => {
  console.log(`Table Tennis Calendar Mock backend listening at http://localhost:${port}`);
});
