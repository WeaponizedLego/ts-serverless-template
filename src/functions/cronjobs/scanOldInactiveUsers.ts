import { ScheduledHandler } from 'aws-lambda'
import * as knex from '@src/resources/knex-manager'

export const handler: () => Promise<void> = async () => {
  const db = knex.connect()
  try {
    const users = await db('users')
      .select('*')
      .where('created_at', '<', new Date().getTime() - 1000 * 60 * 60 * 24 * 7)

    console.log(users)

    await db.destroy()
  } catch (e) {
    console.log('Error:', e)
    await db.destroy()
  }
}
