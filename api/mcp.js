export const config = {
  runtime: 'edge',
};

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const NETEASE_API = "https://netease-music-8x3oxq801-waku3.vercel.app";

const handler = createMcpHandler((server) => {
  server.tool(
    "search_song",
    "搜索网易云音乐歌曲",
    { keyword: z.string().describe("搜索关键词") },
    async ({ keyword }) => {
      const res = await fetch(`${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data.result?.songs || []) }]
      };
    }
  );

  server.tool(
    "get_song_url",
    "获取歌曲播放链接",
    { id: z.string().describe("歌曲ID") },
    async ({ id }) => {
      const res = await fetch(`${NETEASE_API}/song/url?id=${id}`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data.data || []) }]
      };
    }
  );

  server.tool(
    "get_lyric",
    "获取歌词",
    { id: z.string().describe("歌曲ID") },
    async ({ id }) => {
      const res = await fetch(`${NETEASE_API}/lyric?id=${id}`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: data.lrc?.lyric || "无歌词" }]
      };
    }
  );
});

export default handler;
