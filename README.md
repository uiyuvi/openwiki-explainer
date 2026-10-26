# OpenWiki Explainer: Architecture, State Machines & Reality Check

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-black?style=for-the-badge&logo=github)](https://uiyuvi.github.io/openwiki-explainer/)
[![Repository](https://img.shields.io/badge/GitHub-uiyuvi%2Fopenwiki--explainer-181717?style=for-the-badge&logo=github)](https://github.com/uiyuvi/openwiki-explainer)

> **Live Interactive Explainer:** [https://uiyuvi.github.io/openwiki-explainer/](https://uiyuvi.github.io/openwiki-explainer/)

An interactive, visual engineering evaluation and laboratory examining **OpenWiki** (`langchain-ai/openwiki`). Built for software engineers, tech leads, and platform architects to explore how AI coding agents navigate large codebases, evaluate token economics, test CI git-diff automation, and make an informed decision on whether to adopt or avoid OpenWiki.

---

## 📌 Executive Summary: What is OpenWiki?

Released by **LangChain**, **OpenWiki** (`langchain-ai/openwiki`) solves the fundamental challenge AI coding agents (Cursor, Claude Code, GitHub Copilot, Codex, Windsurf) face in medium-to-large repositories:

1. **Without Architecture Docs (The Blind Grep Tax)**:
   An agent answering a cross-package question like *"How does Reporter propagate retry events to Billing?"* fires 7 blind `grep` and `read_file` calls across 25 packages, burning **22,400+ tokens** rediscovering the codebase from scratch.
2. **Inlining Docs in `AGENTS.md` (Context Rot & Attention Dilution)**:
   Pasting complete architecture guides or ADRs into `AGENTS.md` adds 6,800+ tokens to the critical path of *every* session. A developer asking to rename a variable pays for the entire architecture manual on turn 1, and static prose rots silently as code changes.
3. **The OpenWiki Approach (The LLM-to-LLM Memory Layer)**:
   - **Persistent Agent-Native Memory**: Generates a structured markdown wiki in `openwiki/` (using Open Knowledge Format, architecture maps, and grounded claims linking facts to exact code lines and git commit hashes).
   - **`AGENTS.md` Auto-Wiring**: Injects a concise **12-line preamble** into root `AGENTS.md` (~280 tokens, ~28 tokens cached) with an explicit negative guardrail: *"Do not enumerate, preload, or search wikis at task start... Consult openwiki/ only when necessary to ground architecture."*
   - **On-Demand Retrieval**: Agents query the wiki directly or via a **local Model Context Protocol (MCP)** server over `stdio` (`openwiki_search`, `openwiki_read`), pinpointing code in <100ms.
   - **CI Self-Maintenance**: Automatically updates affected claims and markdown pages on git diffs via GitHub Actions or GitLab CI pull requests.

---

## 🔒 Enterprise Data Boundary & Security Guarantee

A critical concern for enterprise teams: **Is code or telemetry sent to LangChain?**

### The Airgap Guarantee: ZERO BYTES SENT
- **100% Local MCP stdio**: OpenWiki is an open-source CLI indexer. Its MCP server runs locally as a child process of your editor communicating over standard I/O (`stdio`). It opens zero network sockets.
- **Zero Data to LangChain**: No proprietary repository code, AST snippets, generated claims, or developer prompts are ever transmitted to LangChain, telemetry endpoints, or third-party servers.
- **Enterprise Model Direct Link**: Tool invocations and context flow directly from your favorite agentic IDE to your configured **enterprise-hosted model** (e.g., self-hosted vLLM in a private VPC, Azure OpenAI Private Endpoint, AWS Bedrock VPC, or Ollama) over your secure internal network.

---

## ⚠️ The 4 Critical Failure Modes (Why Teams Hesitate)

This explorable does not act as a marketing brochure. It provides an unvarnished technical autopsy of OpenWiki's production drawbacks:

| Failure Mode | Operational Mechanism | Engineering Impact |
|---|---|---|
| **01. CI Bot Churn** | `openwiki --update` runs in CI on PR merges, committing changes to `openwiki/.claims/`. | Clutters `git log`, triggers redundant CI build cascades, and causes frequent rebase conflicts on open feature branches. |
| **02. Small-Repo Tax** | On repositories under 100k lines of code or with 1–3 packages, setup overhead dominates. | Time spent configuring MCP JSON and explaining the 12-line preamble to teammates yields negative net ROI. |
| **03. Synthetic Claim Drift** | LLMs distill source code into claims during initial indexing. | If the LLM misinterprets a subtle async race condition or fallback, it codifies an error into a "verified" claim that agents trust over raw code. |
| **04. MCP Latency Overhead** | Tools query a local stdio process via JSON-RPC. | Adds 1–3 seconds of wall-clock round-trip latency per query compared to in-memory prompt tokens. |

---

## 🔍 Deconstructing the "Rename Variable" Benchmark Trap

When teams first inspect `AGENTS.md`, someone typically tests:
> *"Open an agent session and ask it to rename a variable (`usr` -> `user`). Check token counts with and without OpenWiki."*

Without OpenWiki, the session uses 420 tokens. With OpenWiki, it loads 280 startup tokens, leading teams to conclude: *"OpenWiki wasted 280 tokens on a trivial task."*

### Why this evaluation is fundamentally flawed:
1. **Prefix Prompt Caching**: Modern LLMs (Anthropic, OpenAI, Google) cache static system prompts. After Turn 1, the 280-token preamble effectively costs only **~28 tokens** per turn (a 90% discount).
2. **Asymmetric Payoff Math**: Preventing just **one blind grep session** (saving ~21,200 tokens) pays for the 280-token preamble across **75+ uncached** or **750+ cached** trivial rename prompts!
3. **The Proper 3-Part Benchmark**:
   - **Token Baseline**: Test multi-turn sessions to measure effective cached token costs.
   - **Accuracy Check**: Confirm the agent uses `openwiki_search` on architectural questions instead of reading stale ADRs.
   - **False Positive Rate**: Inspect tool traces on 10 trivial tasks. With the 12-line guardrail, wiki tool calls are **0/10**.

---

## 🧪 Popular Evaluation Tests & Why They Mislead

Engineers encountering OpenWiki frequently run tests that appear reasonable on the surface but are fundamentally flawed benchmarks:

| Popular Test | What People Test | Why The Test Is Flawed (Ground Truth) |
|---|---|---|
| **Test 01: The Variable Rename Test** | Run a single-file rename (`usr` -> `user`) and measure token overhead. | **Isolation Bias**: 1-file edits require 0 architectural discovery. Measuring overhead without measuring 1-to-75 cross-package amortized savings ignores modern prefix prompt caching (~90% discount on Turns 2+). |
| **Test 02: The 2-Line Path Trim Test** | Delete the 12-line preamble down to 2 lines: `See openwiki/quickstart.md`. | **The Eager Exploration Trap**: Without the explicit negative constraint *"Do not preload at task start"*, agents greedily read `quickstart.md` on every trivial task (+3,200 tokens). CI also overwrites the manual trim on the next run. |
| **Test 03: The Text Mention Test** | Count keyword occurrences of "OpenWiki" in the agent's final chat output. | **Tool-Call Blindness**: OpenWiki operates over local MCP JSON-RPC (`openwiki_search`), not conversational prose. The agent produces the code silently without uttering "OpenWiki" (0/10 chat mentions despite 100% successful AST grounding). |

---

## 💻 Interactive Laboratory Modules

0. **Agent &harr; Codebase Data Packet Flow (Introductory Topology & Master Toggle)**:
   - **The Overview**: Features an interactive data packet simulator showing how an AI agent traverses a codebase starting from the user prompt.
   - **OpenWiki MCP Toggle Switch (Optimized Highway vs. Broadcast Grep)**:
     - *Disabled (Blind Grep)*: Shows the packet triggering a broadcast ripgrep storm across 25 packages (43 matching files, 22,820 tokens, 6+ round-trips, 35s latency).
     - *Enabled (OpenWiki MCP)*: Shows the streamlined direct path via local stdio MCP (`openwiki_search`) directly to `claim_102.json` and AST lines 42–47 in `dispatcher.ts` (1,200 tokens, 94.7% savings, 1 round-trip, <100ms latency).
   - Includes real-time Data Packet Inspection Console with step-by-step and auto-play controls.

1. **Git-Diff & CI Sync (Solves: Silent Documentation Rot & Re-Indexing Costs)**:
   - **The Problem**: In a 500k-line monorepo, 85% of architecture docs become obsolete within months, and re-indexing the whole repo on every commit would burn $50+ and 20 minutes per PR.
   - **OpenWiki's CI Solution**: Incremental AST Git-Diff. Isolates only modified lines (`dispatcher.ts#L42-L47`), updates only affected claim `claim_102.json` in 2 seconds for $0.001, and pins it to Git commit hashes.
   - Includes interactive Framer Motion diff with animated scanning beam, split/unified views, and live claim JSON synchronizer.
2. **Packet Trace & Benchmarks (Solves: Blind Grep Explosion & The 3 Flawed Benchmark Traps)**:
   - Unified telemetry laboratory with real-time Codex / Antigravity styled HUD (200k context capacity gauge, session burn, cache hits, tool calls).
   - Deconstructs 4 real-world scenarios: Cross-Package Discovery, the 1-File Rename Isolation Bias, the 2-Line Path Trim Trap, and Silent Tool-Call Execution.
3. **Context Architecture & Privacy (Solves: Context Flooding & Zero-LangChain Airgap)**:
   - Visual 3-zone architecture proving that 0 bytes of code or telemetry are sent to LangChain.
   - Universal standard MCP integration for **Cursor, VS Code / Cline, Windsurf, and JetBrains**.
   - 3-tier offloading stack with the 12-line preamble negative guardrail.
4. **Team Decision Matrix & Token Math (Solves: Team Monorepo Adoption Decision)**:
   - Reactive daily workload modeler with sliders for team size, prompt frequency, and cross-package complexity.
5. **Mobile-First Ergonomics**:
   - Docked bottom navigation bar for one-thumb mobile control with $\ge 48\text{px}$ touch targets.
   - Responsive horizontal scrolling containers with sticky headers for code diffs.

---

## 🚀 Getting Started & Deployment

### Local Development
```bash
# Clone the repository
git clone https://github.com/uiyuvi/openwiki-explainer.git
cd openwiki-explainer

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

### Production Build
```bash
# Compile and bundle
npm run build

# Preview production build locally
npm run preview
```

### GitHub Pages Deployment (Live: https://uiyuvi.github.io/openwiki-explainer/)
This repository is configured for out-of-the-box continuous deployment to GitHub Pages at:
👉 **[https://uiyuvi.github.io/openwiki-explainer/](https://uiyuvi.github.io/openwiki-explainer/)**

Key configurations that guarantee zero blank pages on GitHub Pages:
- **Dynamic Base Path (`vite.config.ts`)**: Sets `base: '/openwiki-explainer/'` for production builds so asset bundles (`.js`, `.css`) resolve cleanly with absolute URLs even when visiting without a trailing slash.
- **Bypass Jekyll Processing (`public/.nojekyll`)**: Tells GitHub Pages to skip standard Jekyll builds, ensuring Vite asset chunks and dotfiles are served intact without 404s.
- **SPA Fallback (`public/404.html`)**: Automatically redirects any direct deep link or missing path back to `/openwiki-explainer/`.
- **Automated GitHub Actions (`.github/workflows/deploy.yml`)**: Builds and deploys automatically on every push to `main`.

#### Enabling GitHub Pages on Your Fork / Repo:
1. Push your repository to GitHub (`main` branch):
   ```bash
   git add .
   git commit -m "feat: deploy openwiki explainer"
   git push origin main
   ```
2. Navigate to your repository on GitHub:
   - Click **Settings** &rarr; **Pages** (in the sidebar).
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. The `.github/workflows/deploy.yml` workflow triggers automatically and publishes the site to:
   `https://uiyuvi.github.io/openwiki-explainer/`

### GitLab Pages Deployment
This repository also includes a `.gitlab-ci.yml` pipeline:
1. Push this project to GitLab.
2. The `pages` CI job automatically builds the bundle and deploys the `dist/` directory.
3. Access your live interactive laboratory at `https://<group>.gitlab.io/<project>/`.

---

## 📚 References & Standards
- **OpenWiki Core**: [`langchain-ai/openwiki`](https://github.com/langchain-ai/openwiki)
- **Agent Context Dynamics**: *Empirical Findings on AGENTS.md Preambles & Prompt Ingestion* (`arXiv:2602.11988`)
- **Model Context Protocol**: [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- **Visual Design Standard**: Clean black & white technical aesthetic inspired by *Distill.pub*, *llmdojo*, and Bret Victor's Explorable Explanations.
