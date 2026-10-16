import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { CrossEdit, Lane } from '../types'
import { LANE_NAMES, ownerOf, parseLane } from './lanes'

const LANE_FILE = '.claude/lane.local'

const lane = atom({ plugin: 'forja-hud', key: 'lane' } as const, null)
const crossEdits = atom({ plugin: 'forja-hud', key: 'crossEdits' } as const, [])
const isHidden = atom({ plugin: 'forja-hud', key: 'isHidden' } as const, false)

async function watchEdit($: EngineInterface, path: string) {
  const mine = await read($, lane)
  const owner = ownerOf(path)
  if (mine === null || owner === null || owner === mine) return
  const edit: CrossEdit = { path, owner }
  await update($, crossEdits, list => [...list, edit].slice(-20))
  $.ui.toast(
    owner === 'contracts'
      ? `FORJA: estás tocando un contrato (${path}). Pásalo por forja-architect.`
      : `FORJA: ${path} es del carril ${LANE_NAMES[owner as Lane]}. Avísale a su dueño.`,
  )
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'forja-lane',
      description: 'FORJA: ver o cambiar tu carril (A, B o C)',
    })
    const text = await $.fs.read(LANE_FILE).catch(() => '')
    await update($, lane, () => parseLane(text))

    return next(e)
  })

  on('command.run', { command: 'forja-lane' }, async ($, e) => {
    const picked = parseLane(e.args)
    if (picked === null) {
      const current = await read($, lane)
      return {
        text: current
          ? `Tu carril: ${LANE_NAMES[current]}. Cambia con /forja-lane A|B|C.`
          : 'Sin carril. Usa /forja-lane A|B|C (o /forja-start).',
      }
    }
    await $.fs.write(LANE_FILE, picked + '\n')
    await update($, lane, () => picked)
    await update($, isHidden, () => false)

    return { text: `Carril fijado: ${LANE_NAMES[picked]}.` }
  })

  on('tool.call', { tool: 'Write' }, async ($, e, next) => {
    await watchEdit($, e.file_path)
    return next(e)
  })

  on('tool.call', { tool: 'Edit' }, async ($, e, next) => {
    await watchEdit($, e.file_path)
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const current = await read($, lane)
    if (e.props.hasSurvey || (await read($, isHidden))) return next(e)

    const { Box, Button, Text } = $.ui.resolve(e)
    const edits = await read($, crossEdits)

    return (
      <Box>
        <Text bold>FORJA </Text>
        <Text>{current ? LANE_NAMES[current] : 'sin carril: /forja-lane A|B|C'}</Text>
        {edits.length > 0 && (
          <Text color="yellow">
            {'  '}· {edits.length} edición(es) fuera de tu carril
          </Text>
        )}
        <Text> </Text>
        <Button key="hide" label="Ocultar" onPress={() => update($, isHidden, () => true)} />
      </Box>
    )
  })
}
