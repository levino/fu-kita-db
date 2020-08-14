import { assert } from 'chai'
import * as R from 'ramda'

describe('Manage groups', () => {
  beforeEach(async () => {
    await global.db.migration.up()
  })

  afterEach(async () => {
    await global.db.migration.down()
  })

  test('Addition and removal', async () => {
    await global.db.connection.execute<any>(
      sql`INSERT INTO groups (name, floor) VALUES (?,?);`,
      ['Rotkehlchen', '1'],
    )

    assert.deepEqual(
      R.head(
        await global.db.connection.execute<any>(sql`SELECT * FROM groups;`),
      ),
      [{ id: 1, name: 'Rotkehlchen', floor: '1' }],
      'Should have exactly one group.',
    )

    await global.db.connection.execute<any>(
      sql`INSERT INTO groups (name, floor) VALUES (?,?);`,
      ['Spatzen', '1'],
    )

    await global.db.connection.execute<any>(
      sql`INSERT INTO groups (name, floor) VALUES (?,?);`,
      ['Sonnen', '3'],
    )
    assert.deepEqual(
      R.head(
        await global.db.connection.execute<any>(
          sql`SELECT (name) FROM groups WHERE floor='1'`,
        ),
      ),
      [{ name: 'Rotkehlchen' }, { name: 'Spatzen' }],
      'Should report Rotkehlchen and Spatzen on floor 1.',
    )
  })
})

const sql = (strings: TemplateStringsArray) => strings.raw[0]
