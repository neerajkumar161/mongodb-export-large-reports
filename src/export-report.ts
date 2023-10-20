import 'dotenv/config'
import { AggregateOptions, Document, MongoClient, ServerApiVersion } from 'mongodb'
import { createWriteStream } from 'node:fs'
import { Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { TransformCallback } from 'stream'

const pipeLine: Document[] = [
  {
    $match: {
      age: { $lte: '25' }
    }
  },
  { $limit: 50000 }
]

async function* getDataFromDB() {
  const client = new MongoClient(process.env.DB_URI!, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  })

  const collection = client.db('mydb1').collection('users')

  const usersCursor = collection.aggregate(pipeLine)

  for await (const user of usersCursor) {
    yield JSON.stringify(user)
  }
}

type ReportOptions = {
  db_uri: string
  database: string
  collection: string
  mongodbPipeline: Document[]
  aggregateOptions?: AggregateOptions
}

class TranformData extends Transform {
  private tranformFn: (data: any) => any

  constructor(tranformFn: (data: any) => any) {
    super()
    this.tranformFn = tranformFn
  }

  private convertTranformedData(item: any) {
    // if file type is csv, then we will add break line, and send next pipe
    
    const object = this.tranformFn(item)
    const finalValue = Object.values(object).reduce((prev, curr) => `${prev},${curr}`)
    return `${finalValue}\n`
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    this.push(this.convertTranformedData(chunk))

    callback()
  }
}

const tranformStream = new TranformData((data) => {
  console.log('Data', JSON.parse(data.toString()))
  const jsonData = JSON.parse(data.toString())
  return {
    ...jsonData,
    age: jsonData.age.toString()
  }
})

export async function exportReport() {
  await pipeline(getDataFromDB(), tranformStream, createWriteStream('test.csv'))
}


await exportReport()