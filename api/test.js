export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "content-type": "application/json" },
  });
}
