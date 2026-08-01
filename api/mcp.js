export const config = {
  runtime: 'edge',
};

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const NETEASE_API = "https://netease-music-api-git-main-waku3.vercel.app";

const handler = createMcpHandler((server) => {
  server.registerTool(
    "search_song",
    {
      description: "搜索网易云音乐歌曲",
      inputSchema: z.object({ keyword: z.string().describe("搜索关键词") }),
    },
    async ({ keyword }) => {
      const res = await fetch(`${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data.result?.songs || []) }]
      };
    }
  );

  server.registerTool(
    "get_song_url",
    {
      description: "获取歌曲播放链接",
      inputSchema: z.object({ id: z.string().describe("歌曲ID") }),
    },
    async ({ id }) => {
      const res = await fetch(`${NETEASE_API}/song/url?id=${id}`);
      const data = await res.json();
      return {
        content: [{ type: "text", text: JSON.stringify(data.data || []) }]
      };
    }
  );

  server.registerTool(
    "get_lyric",
    {
      description: "获取歌词",
      inputSchema: z.object({ id: z.string().describe("歌曲ID") }),
    },
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
