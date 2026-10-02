# Build-Ship-Shape-Amazon-Developer-Hack


# Build, Ship, Shape: Amazon Developer Hackathon — Resources

> Build across Amazon Devices and shape what's next.

- **Hackathon page:** https://amazonappdev2026.devpost.com/
- **Resources page:** https://amazonappdev2026.devpost.com/resources
- **Submission deadline:** Oct 23, 2026 @ 12:00pm PDT
- **Join:** https://amazonappdev2026.devpost.com/register
- **Rules:** https://amazonappdev2026.devpost.com/rules · **FAQs:** https://amazonappdev2026.devpost.com/details/faqs · **Updates:** https://amazonappdev2026.devpost.com/updates · **Discussions:** https://amazonappdev2026.devpost.com/forum_topics

Everything needed to go from idea to submission: SDKs, simulators, sample code, docs, and live office hours. Pick a track, grab a starter sample, and build.

---

## Table of Contents
1. [Start Here (all tracks)](#start-here-all-tracks)
2. [AWS Credits](#aws-credits)
3. [Tracks](#tracks)
   - [Fire TV](#fire-tv)
   - [Alexa+](#alexa)
   - [Bee (Wearable AI)](#bee-wearable-ai)
   - [Ring](#ring)
4. [Mini-Challenges](#mini-challenges)
   - [AWS Builder](#aws-builder)
   - [Open Source](#open-source)
5. [Get Help & Connect](#get-help--connect)
6. [Feedback](#your-feedback-shapes-whats-next)

---

## Start Here (all tracks)

| Resource | What it is |
|---|---|
| [Amazon Devices Builder Tools](https://developer.amazon.com/docs/vega/0.24/mcp-server) | MCP server + Agent Skills that bring Amazon device knowledge into your AI coding assistant: crash analysis, performance profiling, docs search, guided setup/optimization workflows. |
| [Amazon Developer documentation](https://developer.amazon.com/docs/apps-and-games/documentation.html) | Specs and guides for building apps across Amazon Devices. |
| [Sample code on GitHub](https://github.com/amazonappdev) | Reference apps, starter projects, libraries. |
| [Developer Community forum](https://community.amazondeveloper.com/c/fire-apps/17) | Discussions and Q&A for Fire TV, Alexa, and Ring developers. |
| [AmazonAppDev on YouTube](https://www.youtube.com/channel/UCT9ApARFgQJOeqD-ygmxnJQ) | Tutorials, talks, workshops. |
| [dev.to/amazonappdev](https://dev.to/amazonappdev) | Technical articles from the team. |
| [Developer newsletter](https://m.amazonappservices.com/hackathon-subscribe) | Product releases and updates. |

## AWS Credits

Request **$150 in AWS credits** while you build via the [credit request form](https://forms.gle/GaHFxSbBQNG9Kti6A).

---

## Tracks

### Fire TV

**Goal:** Build a demo-ready Fire TV app for **Fire OS or Vega OS** using React Native, web technologies, or Android (Kotlin/Java). All tools are free and public.

**Prioritized categories:** AI-enhanced viewing · sports · fitness · family entertainment · multi-modal UX · computer vision

**Tip:** Start with the [Amazon Devices Builder Tools](https://developer.amazon.com/docs/vega/0.24/mcp-server) — the MCP server and Agent Skills teach your AI assistant to build for Fire OS and Vega OS (scaffold, profile, debug against device best practices).

**Starter samples:**

| Repo | Description |
|---|---|
| [react-native-multi-tv-app-sample](https://github.com/AmazonAppDev/react-native-multi-tv-app-sample) | Most complete starter. One codebase for Vega, Android TV, Apple TV, and web; drawer nav, content grid, hero, video player. |
| [react-native-multi-tv-helloworld](https://github.com/AmazonAppDev/react-native-multi-tv-helloworld) | Minimal single-codebase starter across Vega and other TV platforms. |
| [hello-world-fire-tv-react-native](https://github.com/AmazonAppDev/hello-world-fire-tv-react-native) | Five-minute React Native Hello World for Fire TV. |
| [vega-video-sample](https://github.com/AmazonAppDev/vega-video-sample) | Richest Vega reference: W3C media player, focus management, live TV, in-app purchasing, content launcher. |
| [vega-sports-app](https://github.com/AmazonAppDev/vega-sports-app) | Themeable custom content app with catalog and service integration. |
| [vega-audio-sample](https://github.com/AmazonAppDev/vega-audio-sample) | Music player: album, track, search, library, settings. |
| [vega-tv-interfaces-sample](https://github.com/AmazonAppDev/vega-tv-interfaces-sample) | Recommended TV UI patterns: focus, i18n, navigation, scrolling. |
| [hello-world-fire-tv](https://github.com/AmazonAppDev/hello-world-fire-tv) | Native path in Kotlin + Jetpack Compose. |

**Companion reading:** Callstack's free e-book [The Ultimate Guide to React Native TV Development](https://www.callstack.com/ebooks/the-ultimate-guide-to-react-native-tv-development).

**Docs & community:**
- [Fire TV documentation](https://developer.amazon.com/docs/apps-and-games/documentation.html)
- [Vega developer forum](https://community.amazondeveloper.com/c/vega/6)
- [Fire Devices & Appstore forum](https://community.amazondeveloper.com/c/fire-apps/17)

### Alexa+

**Goal:** Build a working **MCP (Model Context Protocol)** integration on the open standards for Agent Skills and Streamable HTTP transports. You can simulate an Alexa+ experience using your preferred agentic tools via a web app.

- [Build with Agent Skills](https://apps.extensions.modelcontextprotocol.io/api/#build-with-agent-skills)
- [Streamable HTTP transport (MCP spec 2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#streamable-http)

### Bee (Wearable AI)

**Goal:** Any project integrating Bee's CLI, MCP, or Agent Skills with other services, devices, or developer tools.

**Priority use cases:** education · developer experience · personal productivity

- [Bee developer documentation](https://docs.bee.computer/) — CLI, MCP server, Bee Skill, and API
- [bee-cli](https://github.com/bee-computer/bee-cli) — command-line client for accessing/exporting your Bee data
- [bee-skill](https://github.com/bee-computer/bee-skill) — Bee Skill for connecting AI agents to Bee context

### Ring

**Goal:** Build a working project on the Ring APIs and devices that shows new functionality. A free Ring account gives access to the Ring (Amazon Vision) APIs.

**Prioritized categories:** access control · business systems · IoT home automation · accessibility · care-taking

- [Ring Developer portal](https://developer.amazon.com/docs/ring/get-started.html) — create a free account, get API access
- [Get started with Ring](https://developer.amazon.com/docs/ring/api-documentation.html) — configure, develop, certify, publish
- [Ring API reference](https://developer.amazon.com/docs/ring/api-documentation.html) — auth, endpoints, webhooks, rate limits, testing, SDKs
- [UX design guide](https://developer.amazon.com/docs/ring/ux-design-guide.html) — design patterns for Ring experiences
- [Live apps and use cases](https://ring.com/appstore) — inspiration from what's shipping
- [Ring Developer community](https://community.amazondeveloper.com/c/ring/53) — announcements and Q&A

**Starter sample:** [ring-api-helloworld](https://github.com/AmazonAppDev/ring-api-helloworld) — the canonical Ring API starter.

---

## Mini-Challenges

Both mini-challenges build **on top of your primary track submission** — not a separate project.

### AWS Builder

Incorporate AWS services with documented integrations into any primary-track project: **Amazon Bedrock, AgentCore, Strands SDK, Kiro, SageMaker**, and more. The AWS free tier is enough to start.

- [AWS Builder Center](https://builder.aws.com/) — learning, community, tutorials, Q&A
- [Learn on Builder Center](https://builder.aws.com/learn) — hands-on tutorials, courses, code samples (Bedrock, AgentCore, Kiro)

### Open Source

Make a contribution to an open-source repository during the hackathon window, alongside your primary submission. Public repos and popular package directories work; no special access needed.

> **Timing tip:** October is also [Hacktoberfest](https://hacktoberfest.com/questions/) (run by Major League Hacking, DEV, and DigitalOcean — not affiliated with this hackathon). Your contributions may count there too, but its 2026 format no longer counts pull requests, so check their current rules.

---

## Get Help & Connect

- **Live office hours** — get unstuck with the Amazon Developer team; schedule and join link are posted on the [landing page](https://amazonappdev2026.devpost.com/).
- **AI tools** — [Amazon Devices Builder Tools](https://developer.amazon.com/docs/vega/0.24/mcp-server) for device-specific scaffolding/debugging; [AWS Builder Center](https://builder.aws.com/) for AWS work.
- [Developer Community forum](https://community.amazondeveloper.com/)
- [Ring Developer community](https://community.amazondeveloper.com/c/ring/53)
- [YouTube](https://www.youtube.com/channel/UCT9ApARFgQJOeqD-ygmxnJQ) — workshops and walkthroughs
- [LinkedIn](https://www.linkedin.com/showcase/amazon-appstore-developers/) — Amazon Devices developer showcase

---

## Your Feedback Shapes What's Next

A core goal of the hackathon is improving the developer experience. Product feedback and feature requests you submit go straight to the teams building **Fire TV, Alexa+, Bee, Ring, and AWS tools** — tell them what worked and what got in your way.

---

*Source: https://amazonappdev2026.devpost.com/resources (retrieved Oct 2, 2026)*
