export interface GraphNode {
  id: string;
  name: string;
  short_name: string;
  full_name?: string;
  isCenter?: boolean;
  isNeighbor?: boolean;
  isFriend?: boolean;
  symbolSize?: number;
  records?: string;
  avatar?: string;
  [key: string]: any;
}

export interface GraphEdge {
  source: string | number;
  target: string | number;
  relation?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const tableTennisData: GraphData = {
  nodes: [
    { id: 'malong', name: '马龙', short_name: '马龙', full_name: '马龙 (Ma Long)', records: '双满贯, 奥运5金', symbolSize: 60 },
    { id: 'fanzhendong', name: '樊振东', short_name: '樊振东', full_name: '樊振东 (Fan Zhendong)', records: '大满贯, 2024奥运冠军', symbolSize: 45 },
    { id: 'xuxin', name: '许昕', short_name: '许昕', full_name: '许昕 (Xu Xin)', records: '人民艺术家, 奥运冠军', symbolSize: 40 },
    { id: 'wangchuqin', name: '王楚钦', short_name: '王楚钦', full_name: '王楚钦 (Wang Chuqin)', records: '世界第一, 奥运冠军', symbolSize: 42 },
    { id: 'liangjingkun', name: '梁靖崑', short_name: '梁靖崑', full_name: '梁靖崑 (Liang Jingkun)', records: '大胖, 世界冠军', symbolSize: 38 },
    { id: 'lingaoyuan', name: '林高远', short_name: '林高远', full_name: '林高远 (Lin Gaoyuan)', records: '小林将军, 世界冠军', symbolSize: 38 },
    { id: 'harimoto', name: '张本智和', short_name: '张本智和', full_name: '张本智和 (Tomokazu Harimoto)', records: '日本主力, 强劲对手', symbolSize: 36 },
    { id: 'ovtcharov', name: '奥恰洛夫', short_name: '奥恰洛夫', full_name: '奥恰洛夫 (Dimitrij Ovtcharov)', records: '德国老将, 奥运奖牌得主', symbolSize: 36 },
    { id: 'moregard', name: '莫雷高德', short_name: '莫雷高德', full_name: '莫雷高德 (Truls Möregårdh)', records: '瑞典天才, 世乒赛亚军', symbolSize: 36 },
  ],
  edges: [
    { source: 'malong', target: 'fanzhendong', relation: '队友/决赛对手' },
    { source: 'malong', target: 'xuxin', relation: '黄金搭档' },
    { source: 'malong', target: 'harimoto', relation: '经典对决' },
    { source: 'fanzhendong', target: 'wangchuqin', relation: '队友' },
    { source: 'fanzhendong', target: 'moregard', relation: '2024奥运决赛' },
    { source: 'wangchuqin', target: 'liangjingkun', relation: '队友' },
    { source: 'xuxin', target: 'lingaoyuan', relation: '队友' },
    { source: 'malong', target: 'ovtcharov', relation: '老对手' },
  ]
};
