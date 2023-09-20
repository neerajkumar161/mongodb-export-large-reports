import { createReadStream } from 'node:fs';
import { Transform, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { CSVTOJSON } from './csvToJSON.js';

const FILE_NAME = 'database.csv'
//Read CSV file one line at a time and insert it one by one

console.log('Hey There!!!!')


const stream = createReadStream(FILE_NAME)
let lineCount = 0

const transformStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log(`Chunk`, JSON.parse((chunk.toString())))
    callback()
  }
})

const csvTOJSON = new CSVTOJSON({ delimeter: ',', headers: [ 
  'firstName',
  'lastName',
  'age',
  'gender',
  'country']
})

await pipeline(
  stream,
  csvTOJSON,
  transformStream,
  new Writable({
    write(chunk, encoding, callback) {
      // console.log('Chunk here', chunk.toString())
      callback()
    }
  }
  )
)


// stream.on('data', (chunk) => {
//     // console.log(`Chunk`, chunk.toString())
//     console.log(`ChunkFirt`, chunk.toString(), 'Each Chunk')
//     // console.log(`Chunk`, Buffer.from(chunk.toString()))
// }).on('end', () => {
//   console.log('Chunk Read Done!!')
// })