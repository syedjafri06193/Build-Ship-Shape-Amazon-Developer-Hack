# Devpost submission kit: Pantry Chef

**Track:** Alexa+ · **Deadline:** Oct 23, 2026, 12:00pm PDT

## Submission checklist

- [ ] Push this folder to a **public GitHub repo** with the MIT license included
- [ ] Record the **demo video** (script below, about 3 minutes) and upload it to YouTube or Vimeo as public or unlisted
- [ ] *(Optional)* Deploy it so judges can try it live (`docker build`, then any container host)
- [ ] Fill in the Devpost form using the text below. Attach `docs/screenshot.png` and an architecture image
- [ ] Re-read the official rules for required fields: https://amazonappdev2026.devpost.com/rules

---

## Devpost text (paste-ready)

**Tagline:** Cook with what you have. An Alexa+ MCP integration that rescues expiring food and walks you through dinner hands-free.

### Inspiration
A third of the food we buy gets thrown away, usually because nobody remembers the spinach until it's slimy. And when you finally cook, you're scrolling a recipe with eggy fingers. We wanted Alexa+ to handle both problems: remember what's in the kitchen, and talk you through using it.

### What it does
Pantry Chef tracks your pantry and expiry dates. When you ask "what can I make?" it ranks recipes by how much of your kitchen they use, favoring items about to go bad. Say "yes" and it becomes a hands-free sous-chef. It reads one step at a time, understands "next", "go back" and "say that again", offers timers that match the step, and takes used-up ingredients off your pantry when you finish.

### How we built it
- An **MCP server** in TypeScript on the official SDK, served over **Streamable HTTP** (spec 2025-11-25) in stateless mode, with 12 tools and a recipe resource.
- Every tool returns a speakable `speech` string *and* structured `data`, so it works on voice-only devices and screen devices alike.
- An **Agent Skill** (`SKILL.md`) encodes the voice-first conversation rules: one step at a time, a bare "yes" accepts the offered timer, and the assistant leads with waste reduction.
- A **web Alexa+ simulator** acts as a real MCP client: it handles the initialize, tools/list and tools/call handshake, has speech recognition and synthesis, an Echo Show-style step card, and a live log of every tool call.

### Challenges we ran into
Voice cooking is all about **context**. Short words like "yes", "next" and "done" mean different things depending on what was just said. We kept the cooking session server-side, keyed by household, so any client — Alexa+, the simulator, or the MCP Inspector — can resume the same session without re-explaining.

### Accomplishments we're proud of
A complete, tested MCP integration. An end-to-end smoke test drives every tool through the official MCP client, and a full cook-along demo runs in under three minutes.

### What we learned
Designing tools for voice is different from designing them for chat. Tool outputs must be short, speakable, and end with a clear next action ("Want a 4 minute timer?").

### What's next
LLM-generated recipes for any pantry, importing groceries from receipts and photos, shopping lists for missing ingredients, and proactive morning nudges ("your spinach expires tomorrow").

### Built with
`typescript` · `node.js` · `model-context-protocol` · `streamable-http` · `agent-skills` · `express` · `zod` · `web-speech-api`

### Feedback for the Alexa+ team (the hackathon asks for this)
- Make it clearer how Alexa+ chooses between overlapping tools, and how to hint at that (for example, "next" vs. a generic "continue").
- Provide a reference pattern for returning speech alongside structured output for screen devices.
- Offer a hosted simulator or test harness for MCP integrations, so builders don't have to make their own.

---

## Demo video script (about 3:00)

| Time | Show | Say |
| --- | --- | --- |
| 0:00–0:20 | Fridge, or a pantry full of food | "A third of the food we buy ends up in the trash. Pantry Chef is an Alexa+ integration that helps you cook what you already have, hands-free." |
| 0:20–0:40 | The simulator, with the pantry panel showing red "1d" pills | "It knows what's in my kitchen. Alexa, what's expiring soon?" (Click the orb and speak.) |
| 0:40–1:10 | Recipe suggestion, then the step card | "What can I make for dinner?" → frittata. "Yes." Point out that it chose the frittata *because* it uses the spinach and feta. |
| 1:10–1:50 | Cooking: Next → Yes (timer) → Repeat that → Go back | Show the progress bar and the timer counting down. "My hands are covered in egg. I never touched a screen." |
| 1:50–2:10 | Finish the recipe | "When I'm done, it takes the spinach and feta off my pantry automatically." |
| 2:10–2:40 | The MCP tool-call log, then the MCP Inspector against `/mcp` | "Under the hood: a standard MCP server over Streamable HTTP. 12 tools, each returning speech for voice devices and structured data for screens, plus an Agent Skill that teaches the assistant to cook like a calm sous-chef." |
| 2:40–3:00 | README and roadmap | "Next: LLM recipes for any pantry, receipt import, and morning nudges. Pantry Chef: waste less, cook more." |

**Recording tips:** Before recording, click **Reset demo** so the pantry is fresh. Use Chrome for voice. If the room is noisy, type the commands instead; the text-to-speech still reads the answers aloud.
