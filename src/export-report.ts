import 'dotenv/config'
import { Document, MongoClient, ServerApiVersion } from 'mongodb'
import { Transform, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const client = new MongoClient(process.env.DB_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

const pipeLine: Document[] = [
  {
    $match: {
      age: { $lte: '25' }
    }
  },
  { $limit: 50000 }
]

async function* getDataFromDB() {
  const collection = client.db('mydb1').collection('users')

  const usersCursor = collection.aggregate(pipeLine)

  for await (const user of usersCursor) {
    // yield Buffer.from(`${user}`)
    yield JSON.stringify(user)
  }
}

function tranformData() {}
let counter = 0;
await pipeline(
  getDataFromDB(),
  new Transform({
    transform(chunk, encoding, callback) {
      // format the data according to the needs
      console.log(JSON.parse(chunk.toString()), ++counter)
      callback(null, chunk)
    }
  }),
  new Writable({
    write(chunk, encoding, callback) {
      // console.log(chunk)
      callback()
    }
  })
)

type ReportOptions = {db_uri: string, database: string, collection: string, mongodbPipeline: Document[]}


class ExportReport extends Transform {
  private options: ReportOptions
  private tranformFn: () => void
 
  constructor(options: ReportOptions) {
    super()
    this.options = options
  }

  private async *connectDB() {
    const client = new MongoClient(this.options.db_uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })

    const collection = client.db(this.options.database).collection(this.options.collection)

    const usersCursor = collection.aggregate(this.options.mongodbPipeline)

    for await (const user of usersCursor) {
      // yield Buffer.from(`${user}`)
      yield JSON.stringify(user)
    }
  }

  
}