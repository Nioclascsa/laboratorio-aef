import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })

async function check() {
  try {
    const client = await pool.connect()
    console.log('Connected successfully')
    const res = await client.query('SELECT NOW()')
    console.log('Query result:', res.rows[0])
    client.release()
    await pool.end()
  } catch (err) {
    console.error('Connection error', err)
    process.exit(1)
  }
}

check()