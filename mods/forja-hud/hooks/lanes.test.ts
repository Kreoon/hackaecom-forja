import { expect, test } from 'claude-code/testing'

import { ownerOf, parseLane } from './lanes'

test('asigna cada carpeta a su carril', () => {
  expect(ownerOf('src/lib/ai/prompts/page.compose.ts')).toBe('A')
  expect(ownerOf('src/lib/ingest/audio.ts')).toBe('A')
  expect(ownerOf('src/components/sections/Hero.tsx')).toBe('B')
  expect(ownerOf('D:\\repo\\src\\app\\page.tsx')).toBe('B')
  expect(ownerOf('src/lib/shopify/compile.ts')).toBe('C')
  expect(ownerOf('shopify/sections/forja-hero.liquid')).toBe('C')
  expect(ownerOf('src/contracts/pagespec.ts')).toBe('contracts')
  expect(ownerOf('supabase/migrations/0001_init.sql')).toBe('contracts')
  expect(ownerOf('README.md')).toBe(null)
})

test('lee el carril escrito a mano', () => {
  expect(parseLane('b\n')).toBe('B')
  expect(parseLane(' C ')).toBe('C')
  expect(parseLane('')).toBe(null)
  expect(parseLane('x')).toBe(null)
})
