# {{PROJECT_NAME}} Architecture

This document describes the current system structure.
It is the primary reference for any AI assistant or contributor working in this repo.

---

## System Overview

{{SYSTEM_OVERVIEW}}

```
{{ASCII_DIAGRAM}}
```

---

## Repository Layout

```
{{PROJECT_NAME}}/
├── {{FOLDER_1}}/             {{FOLDER_1_DESCRIPTION}}
├── {{FOLDER_2}}/             {{FOLDER_2_DESCRIPTION}}
├── docs/
│   ├── architecture.md       This file
│   ├── engineering-guidelines.md
│   ├── product-design.md
│   ├── backlog.md
│   ├── plans/                Implementation plans
│   └── tests/                Test coverage tracking
├── CLAUDE.md                 Instructions for AI assistants
├── LESSONS.md                Session learnings log
└── README.md                 Human-facing project overview
```

---

## {{LAYER_1_NAME}}

**Runtime:** {{LAYER_1_RUNTIME}}
**Default port:** {{LAYER_1_PORT}}

### Structure

```
{{LAYER_1_STRUCTURE}}
```

### Data Model

```
{{DATA_MODEL}}
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| {{METHOD}} | {{PATH}} | {{DESCRIPTION}} |

---

## {{LAYER_2_NAME}}

**Runtime:** {{LAYER_2_RUNTIME}}
**Default port:** {{LAYER_2_PORT}}

### Structure

```
{{LAYER_2_STRUCTURE}}
```

---

## How a Request Flows End to End

```
{{REQUEST_FLOW}}
```

---

## Known Architectural Limitations

These are tracked as GitHub issues:

| Issue | Description |
|-------|-------------|
| - | None identified yet |

---

## What Does Not Exist Yet

These are planned but not built:

- {{PLANNED_FEATURE_1}}
