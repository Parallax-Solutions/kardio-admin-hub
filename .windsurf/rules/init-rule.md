---
trigger: always_on
---

# Agent-OS Development Rules

## Overview

This project uses the **Agent-OS** workflow system for structured product development. Follow these rules when working on this codebase.

## Primary Workflow

Start any new product planning or feature development by following the command workflow defined in:

- **Entry Point:** [.claude/commands/agent-os/plan-product.md](cci:7://file:///c:/Users/Ricmor/Documents/projects/kardio-admin-hub/.claude/commands/agent-os/plan-product.md:0:0-0:0)

This command orchestrates the entire development lifecycle through specialized subagents.

## Command Flow

Execute commands in this order for new features:

1. `/plan-product` — Create mission, roadmap, and tech stack
2. `/shape-spec` — Initialize spec and gather requirements
3. `/write-spec` — Generate detailed specification
4. `/create-tasks` — Break spec into actionable tasks
5. `/implement-tasks` — Build the feature

## Subagent Reference

The primary subagent that drives product planning is:

- **Root Agent:** [.claude/agents/agent-os/product-planner.md](cci:7://file:///c:/Users/Ricmor/Documents/projects/kardio-admin-hub/.claude/agents/agent-os/product-planner.md:0:0-0:0)

This agent creates:
- `agent-os/product/mission.md` — Product vision and strategy
- `agent-os/product/roadmap.md` — Prioritized feature checklist
- `agent-os/product/tech-stack.md` — Technology decisions

## Standards Compliance

All implementations must align with standards defined in:

- `agent-os/standards/global/` — Coding style, conventions, error handling
- `agent-os/standards/frontend/` — Components, CSS, accessibility
- `agent-os/standards/backend/` — API, models, migrations
- `agent-os/standards/testing/` — Test writing guidelines

## Key Constraints

- **Test Limits:** Each task group writes 2-8 focused tests maximum
- **Reusability:** Always search for existing patterns before creating new code
- **Specs Location:** All specs live in `agent-os/specs/YYYY-MM-DD-spec-name/`
- **No Code in Specs:** Specification documents describe requirements, not implementation