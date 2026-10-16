import type { Lane } from '../types'

export const LANE_NAMES: Record<Lane, string> = {
  A: 'A · Cerebro IA',
  B: 'B · App + Mockup',
  C: 'C · Shopify',
}

const OWNERS: Array<[RegExp, Lane | 'contracts']> = [
  [/(^|\/)src\/contracts\//, 'contracts'],
  [/(^|\/)supabase\/migrations\//, 'contracts'],
  [/(^|\/)src\/lib\/(ai|ingest)\//, 'A'],
  [/(^|\/)src\/(app|components|styles)\//, 'B'],
  [/(^|\/)(src\/lib\/shopify|shopify)\//, 'C'],
]

export function ownerOf(path: string): Lane | 'contracts' | null {
  const normalized = path.replace(/\\/g, '/')
  for (const [re, owner] of OWNERS) {
    if (re.test(normalized)) return owner
  }
  return null
}

export function parseLane(text: string): Lane | null {
  const letter = text.trim().toUpperCase().charAt(0)
  return letter === 'A' || letter === 'B' || letter === 'C' ? letter : null
}
