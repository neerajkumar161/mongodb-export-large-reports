import { createReadStream } from 'node:fs'

const FILE_NAME = 'database.csv'
//Read CSV file one line at a time and insert it one by one

console.log('Hey There!!!!')


const stream = createReadStream(FILE_NAME)
let lineCount = 0

stream.on('data', (chunk) => {
    // console.log(`Chunk`, chunk.toString())
    console.log(`ChunkFirt`, chunk.toString(), 'Each Chunk')
    // console.log(`Chunk`, Buffer.from(chunk.toString()))
}).on('end', () => {
  console.log('Chunk Read Done!!')
})