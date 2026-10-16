export type Lane = 'A' | 'B' | 'C'
export type CrossEdit = { path: string; owner: Lane | 'contracts' }

declare module 'claude-code' {
  interface PluginState {
    'forja-hud': { lane: Lane | null; crossEdits: CrossEdit[]; isHidden: boolean }
  }
}
