import 'dotenv/config'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { createReadStream } from 'node:fs'
import { Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { CSVTOJSON } from './csvToJSON.js'
const FILE_NAME = 'database.csv'
const BATCH_SIZE = 10000

const stream = createReadStream(FILE_NAME)

let counter = 0

let client = new MongoClient(process.env.DB_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

function batchRecords() {
  let batchCounter = 0
  let currentBatch: any[] = []
  return new Transform({
    async transform(chunk, encoding, callback) {
      const eachChunk = JSON.parse(chunk.toString())
      const result = JSON.stringify({ ...eachChunk, id: counter++ })

      currentBatch.push({ ...eachChunk })

      if (currentBatch.length >= BATCH_SIZE) {
        batchCounter += currentBatch.length
        console.log('Inserting the documents', currentBatch, batchCounter)
        await client.db('mydb1').collection('users').insertMany(currentBatch)
        currentBatch = []
      }

      callback(null, result)
    },
    async final(callback) {
      if (currentBatch.length > 0) {
        console.log(`Inserting last  ${currentBatch.length} records`)
        await client.db('mydb1').collection('users').insertMany(currentBatch)
        currentBatch = []
      }
      console.log('Im done tranforming data!!')

      callback()
    }
  })
}

const csvTOJSON = new CSVTOJSON({ delimeter: ',', headers: ['firstName', 'lastName', 'age', 'gender', 'country'] })

try {
  await client.connect()
  console.time('totalTime')
  await pipeline(
    stream,
    csvTOJSON,
    batchRecords(),
    new Writable({
      write(chunk, encoding, callback) {
        callback()
      }
    })
  )
  console.timeEnd('totalTime')
} catch (error) {
  if (error instanceof Error) console.log('Error occured!', error.message)
}
