// Pantry Chef MCP server over Streamable HTTP (MCP spec 2025-11-25), plus the web Alexa+ simulator.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import * as d from "./domain.js";

const say = (speech: string, data: unknown) => ({
  content: [{ type: "text" as const, text: speech }],
  structuredContent: { speech, data } as Record<string, unknown>,
});
const list = (xs: string[]) => xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`;
const fmtLeft = (n?: number) => n === undefined ? "" : n <= 0 ? " (expires today)" : n === 1 ? " (1 day left)" : ` (${n} days left)`;

export function buildServer(householdId: string) {
  const h = d.household(householdId);
  const server = new McpServer({ name: "pantry-chef", version: "1.0.0" }, {
    instructions: "Pantry Chef helps a household cook with what they already have. Prefer recipes that use expiring items. " +
      "During cooking, speak one step at a time and offer the suggested timer. Each tool returns a short `speech` string ready to read aloud.",
  });

  server.registerTool("add_pantry_item", {
    title: "Add pantry item", description: "Add or top up an item in the pantry, optionally with days until it expires.",
    inputSchema: { name: z.string(), quantity: z.number().positive().default(1), unit: z.string().default("count"),
      expiresInDays: z.number().int().min(0).optional() },
  }, async ({ name, quantity, unit, expiresInDays }) => {
    const item = d.addItem(h, name, quantity, unit, expiresInDays);
    return say(`Added ${name} to your pantry${expiresInDays !== undefined ? `, expiring in ${expiresInDays} days` : ""}.`, item);
  });

  server.registerTool("remove_pantry_item", {
    title: "Remove pantry item", description: "Remove an item that has been used up or thrown away.",
    inputSchema: { name: z.string() },
  }, async ({ name }) => {
    const removed = d.removeItem(h, name);
    return say(removed ? `Removed ${removed}.` : `I couldn't find ${name} in your pantry.`, { removed: removed ?? null });
  });

  server.registerTool("list_pantry", {
    title: "List pantry", description: "List everything in the pantry, soonest-expiring first.", inputSchema: {},
    annotations: { readOnlyHint: true },
  }, async () => {
    const items = d.listPantry(h);
    return say(items.length ? `You have ${items.length} items: ${list(items.map(i => i.name))}.` : "Your pantry is empty.", items);
  });

  server.registerTool("whats_expiring", {
    title: "What's expiring", description: "Items expiring within the given number of days (default 3).",
    inputSchema: { withinDays: z.number().int().min(0).default(3) }, annotations: { readOnlyHint: true },
  }, async ({ withinDays }) => {
    const items = d.expiringSoon(h, withinDays);
    return say(items.length ? `Use these soon: ${list(items.map(i => i.name + fmtLeft(i.daysLeft)))}.`
      : `Nothing expires in the next ${withinDays} days.`, items);
  });

  server.registerTool("suggest_recipes", {
    title: "Suggest recipes", description: "Recipes ranked by how much of the pantry they use, favoring expiring items.",
    inputSchema: { limit: z.number().int().min(1).max(5).default(3) }, annotations: { readOnlyHint: true },
  }, async ({ limit }) => {
    const recs = d.suggestRecipes(h, limit);
    const top = recs[0];
    const why = top.usesExpiring.length ? `, which uses up your ${list(top.usesExpiring)}` : "";
    const missing = top.missing.length ? ` You'd need ${list(top.missing)}.` : " You have everything for it.";
    return say(`I'd make ${top.title}${why}. It takes about ${top.minutes} minutes.${missing}` +
      (recs.length > 1 ? ` Other options: ${list(recs.slice(1).map(r => r.title))}.` : ""), recs);
  });

  server.registerTool("start_cooking", {
    title: "Start cooking", description: "Begin a hands-free, step-by-step cooking session for a recipe.",
    inputSchema: { recipe: z.string().describe("Recipe id or title, e.g. 'spinach frittata'") },
  }, async ({ recipe }) => {
    const s = d.startCooking(h, recipe);
    if (!s) return say(`I don't have a recipe for ${recipe}. Try asking what you can make.`, null);
    return say(`Let's make ${s.recipe}. You'll need ${list(s.ingredients)}. Step 1 of ${s.of}: ${s.text}` +
      (s.suggestedTimerMinutes ? ` Want a ${s.suggestedTimerMinutes} minute timer?` : ""), s);
  });

  const stepSpeech = (r: ReturnType<typeof d.moveStep>) => {
    if (!r) return say("You're not cooking anything right now. Say which recipe to start.", null);
    if ("done" in r) return say(`That's it, ${r.recipe} is ready. Enjoy!` +
      (r.usedUp.length ? ` I've taken ${list(r.usedUp)} off your pantry.` : ""), r);
    return say(`Step ${r.step} of ${r.of}: ${r.text}` + (r.suggestedTimerMinutes ? ` Want a ${r.suggestedTimerMinutes} minute timer?` : "") +
      (r.isLast ? " This is the last step." : ""), r);
  };

  server.registerTool("next_step", { title: "Next step", description: "Advance to the next cooking step.", inputSchema: {} },
    async () => stepSpeech(d.moveStep(h, 1)));
  server.registerTool("previous_step", { title: "Previous step", description: "Go back one cooking step.", inputSchema: {} },
    async () => stepSpeech(d.moveStep(h, -1)));
  server.registerTool("repeat_step", { title: "Repeat step", description: "Repeat the current cooking step.", inputSchema: {},
    annotations: { readOnlyHint: true } }, async () => stepSpeech(d.currentStep(h)));

  server.registerTool("set_timer", {
    title: "Set timer", description: "Start a kitchen timer. If minutes is omitted, uses the current step's suggested time.",
    inputSchema: { minutes: z.number().positive().optional(), label: z.string().optional() },
  }, async ({ minutes, label }) => {
    const step = d.currentStep(h);
    const m = minutes ?? step?.suggestedTimerMinutes;
    if (!m) return say("How many minutes should the timer be?", null);
    const t = d.setTimer(h, m, label ?? (step ? `${step.recipe}, step ${step.step}` : undefined));
    return say(`Timer set for ${m} minute${m === 1 ? "" : "s"}.`, t);
  });

  server.registerTool("check_timers", {
    title: "Check timers", description: "How much time is left on running timers.", inputSchema: {}, annotations: { readOnlyHint: true },
  }, async () => {
    const ts = d.listTimers(h);
    if (!ts.length) return say("No timers are running.", ts);
    const fmt = (s: number) => s >= 60 ? `${Math.floor(s / 60)} minute${s >= 120 ? "s" : ""}${s % 60 ? ` ${s % 60} seconds` : ""}` : `${s} seconds`;
    return say(ts.map(t => t.done ? `${t.label} is done!` : `${t.label}: ${fmt(t.secondsLeft)} left`).join(". ") + ".", ts);
  });

  server.registerTool("cancel_timer", {
    title: "Cancel timer", description: "Cancel one timer by id, or all timers.", inputSchema: { id: z.number().int().optional() },
  }, async ({ id }) => {
    const n = d.cancelTimer(h, id);
    return say(n ? `Cancelled ${n} timer${n === 1 ? "" : "s"}.` : "There was no timer to cancel.", { cancelled: n });
  });

  server.registerResource("recipes", "pantry://recipes", { title: "Recipe book", mimeType: "application/json" },
    async uri => ({ contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(d.RECIPES, null, 2) }] }));

  return server;
}

const app = express();
app.use(express.json());
const here = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(here, "..", "web")));

// Stateless Streamable HTTP: a fresh server + transport per request; household state lives in the domain layer.
app.post("/mcp", async (req, res) => {
  const householdId = String(req.header("x-household") ?? "demo").slice(0, 64);
  const server = buildServer(householdId);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
const notAllowed = (_: express.Request, res: express.Response) =>
  res.status(405).json({ jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed (stateless server)." }, id: null });
app.get("/mcp", notAllowed);
app.delete("/mcp", notAllowed);

app.post("/api/reset", (req, res) => { d.resetHousehold(String(req.header("x-household") ?? "demo")); res.json({ ok: true }); });
app.get("/healthz", (_, res) => res.json({ ok: true }));

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => console.log(`Pantry Chef: MCP at http://localhost:${port}/mcp, simulator at http://localhost:${port}/`));
