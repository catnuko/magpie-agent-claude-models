# magpie-agent-claude-models

Make magpie's Claude Code models visible to host apps that embed Claude Code
(OpenMausBot and the like) — a stopgap until magpie does it itself
([yetone/magpie#5081](https://github.com/yetone/magpie/issues/5081)).

## The gap

magpie wires Claude Code by writing `~/.claude/settings.json`:

- `modelPicker.options` — the models it serves; Claude Code's own `/model`
  shows them.
- `env.ANTHROPIC_DEFAULT_*_MODEL`, `model` — the routing setup.

A host app that **embeds** Claude Code and builds its own model dropdown never
reads `modelPicker`. OpenMausBot's Claude engine, for one, builds its list from
`settings.availableModels` / `customModels` / `extraModels`, so it shows only the
stock Claude models plus whatever `ANTHROPIC_DEFAULT_*_MODEL` names — none of
magpie's.

## What this does

magpie hands every agent plugin the model list it serves to that agent. This
plugin is an "agent" for the very file magpie's Claude Code wiring already
manages, and its connect writes that same list under `availableModels`:

```json
"availableModels": ["auto/deepseek-v4.1-flash[1m]", "auto/glm-5.3-flash[1m]", "…"]
```

Ids are spelled the picker's way — `[1m]` on the 1,000,000-token-context models —
so both keys read alike. It re-runs on every model-set/Sync, and magpie stashes
the previous `availableModels` and restores it on disconnect.

## Install

```
magpie plugin add github:catnuko/magpie-agent-claude-models
magpie claude-host-models provider magpie        # connect it
```

Then reopen OpenMausBot (it reads `~/.claude/settings.json` at start-up).

Nothing else in the file is touched: `modelPicker`, `model`, `env` and the rest
stay as magpie wrote them, and only the `availableModels` key is edited (magpie
stashes its old value). To undo:

```
magpie claude-host-models default                # puts the key back
```

## Notes

- magpie ends up with a second row pointing at `~/.claude/settings.json` (the
  built-in *Claude Code* row, and this one). Expected: a plugin cannot take over,
  or add a field to, a built-in agent.
- Written and verified against magpie `0.1.2848` on macOS. Verified here that a
  user-level `availableModels` is not enforced as a lock by Claude Code (a model
  outside the list still runs), so it is a list host readers can use.
- Stop-gap only: once magpie itself publishes a host-readable list, uninstall
  this (`magpie plugin rm github:catnuko/magpie-agent-claude-models`).

## 中文

把 magpie 写给 Claude Code 的模型清单（`modelPicker`）同步一份到
`availableModels`，这样把 Claude Code 当引擎、自己建模型下拉的宿主程序
（如 OpenMausBot）也能列出 magpie 的模型。只改 `availableModels` 这一个键，
断开即还原。装完重开宿主程序生效。

## License

MIT