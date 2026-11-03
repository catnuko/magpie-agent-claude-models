// magpie's Claude Code wiring writes the models it serves into
// `~/.claude/settings.json` under `modelPicker.options`, and `[1m]` marks the
// 1,000,000-token-context entries. That key is Claude Code's own: a host app that
// embeds Claude Code and builds its own model dropdown never reads it, so the
// magpie models are missing there (OpenMausBot is the concrete case).
//
// magpie hands every agent plugin the model list it serves to that agent, so this
// republishes the same list under `availableModels` — the key such a host reader
// uses — beside the picker magpie already writes. The ids are spelled exactly the
// way the picker spells them, `[1m]` suffix included, so both lists read alike.
//
// Only `availableModels` is touched. magpie stashes the prior value and restores
// it on disconnect; everything else in the file is left as magpie wrote it.
export const agent = {
  id: "claude-host-models",
  name: "Claude Code · host model list",
  config: "~/.claude/settings.json",
  format: "json",
  notice: "Claude Code and host apps read this file at start-up: reopen them to pick the change up.",
};

export function connect({ models }) {
  const ids = [];
  const seen = new Set();
  for (const m of models || []) {
    if (!m || !m.id || seen.has(m.id)) continue;
    seen.add(m.id);
    ids.push(m.context >= 1000000 ? m.id + "[1m]" : m.id);
  }
  return { availableModels: ids };
}