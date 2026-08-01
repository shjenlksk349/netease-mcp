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
      description: "获取歌曲播放链接,并生成可点击的快捷指令跳转链接用于播放",
      inputSchema: z.object({ id: z.string().describe("歌曲ID") }),
    },
    async ({ id }) => {
      const res = await fetch(`${NETEASE_API}/song/url?id=${id}`);
      const data = await res.json();
      const songUrl = data.data?.[0]?.url || "";
      const shortcutUrl = `shortcuts://run-shortcut?name=${encodeURIComponent("网易云音乐")}&input=${encodeURIComponent(songUrl)}`;
      return {
        content: [{
          type: "text",
          text: `播放链接: ${songUrl}\n\n点击这个链接直接播放: ${shortcutUrl}`
        }]
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
