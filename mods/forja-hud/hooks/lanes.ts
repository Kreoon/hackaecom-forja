import type { Lane } from '../types'

export const LANE_NAMES: Record<Lane, string> = {
  A: 'A · Cerebro + backend',
  B: 'B · Producto + preview',
  C: 'C · Shopify + calidad',
}

const OWNERS: Array<[RegExp, Lane | 'contracts']> = [
  [/(^|\/)src\/contracts\//, 'contracts'],
  [/(^|\/)supabase\/migrations\//, 'contracts'],
  [/(^|\/)src\/lib\/(ai|ingest|server)\//, 'A'],
  [/(^|\/)src\/(app|components|styles)\//, 'B'],
  [/(^|\/)(src\/lib\/(shopify|publish)|shopify|e2e|\.github)\//, 'C'],
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
