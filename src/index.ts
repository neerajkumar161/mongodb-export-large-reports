import { createReadStream } from 'node:fs'
import { Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { CSVTOJSON } from './csvToJSON.js'

const FILE_NAME = 'database.csv'

const stream = createReadStream(FILE_NAME)

let counter = 0

function batchRecords() {
  const BATCH_SIZE = 3000
  let batchCounter = 0
  let currentBatch: any[] = []
  return new Transform({
    transform(chunk, encoding, callback) {
      const eachChunk = JSON.parse(chunk.toString())
      const result = JSON.stringify({ ...eachChunk, id: counter++ })

      currentBatch.push({ ...eachChunk })

      if (currentBatch.length >= BATCH_SIZE) {
        batchCounter += currentBatch.length
        console.log('Inserting the documents', currentBatch, batchCounter)
        currentBatch = []
      }

      callback(null, result)
    },
    final(callback) {
      if (currentBatch.length > 0) {
        console.log(`Inserting last  ${currentBatch.length} records`)
        currentBatch = []
      }
      console.log('Im done tranforming data!!')

      callback()
    }
  })
}

const csvTOJSON = new CSVTOJSON({ delimeter: ',', headers: ['firstName', 'lastName', 'age', 'gender', 'country'] })

try {
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
} catch (error) {
  if (error instanceof Error) console.log('Error occured!', error.message)
}
