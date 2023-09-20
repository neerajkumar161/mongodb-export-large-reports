import { Transform } from 'node:stream'
import { TransformCallback } from 'stream'

const BREAK_LINE = '\n'

export class CSVTOJSON extends Transform {
  private delimeter: string
  private headers: Array<string>
  private buffer: Buffer = Buffer.alloc(0) // Initial buffer will be of length 0, <Buffer >

  constructor(options: { delimeter: string; headers: Array<string> }) {
    super()
    this.delimeter = options.delimeter
    this.headers = options.headers
  }

  private *updateBuffer(chunk: Uint8Array) {
    // Concat the chunk with current buffer
    this.buffer = Buffer.concat([this.buffer, chunk])

    let breakLineIdx = 0

    // loop will not work, if there is no newline symbol in end of string, _final method will handle that case
    while (breakLineIdx !== -1) {
      // check in current buffer, breakLine exists or not
      breakLineIdx = this.buffer.indexOf(Buffer.from(BREAK_LINE))

      if (breakLineIdx == -1) break

      const lineToProcessIndex = breakLineIdx + BREAK_LINE.length
      const lineData = this.buffer.subarray(0, lineToProcessIndex).toString()

      this.buffer = this.buffer.subarray(lineToProcessIndex) // remove the data from buffe, we already processed

      if (lineData === BREAK_LINE) break

      const JSONLine = []
      const headers = Array.from(this.headers)

      for (const item of lineData.split(this.delimeter)) {
        const key = headers.shift()
        const value = item.replace(BREAK_LINE, '')
        // console.log('Key', key, 'value', value)
        if (key === value) break // skipping the headers in file

        JSONLine.push(`"${key}":"${value}"`)
      }

      if (!JSONLine.length) continue

      const record = JSONLine.join(',')

      yield Buffer.from(`{${record}}${BREAK_LINE}`)
    }
  }

  // Generator to Tranform and get the data
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    for (const item of this.updateBuffer(chunk)) {
      this.push(item)
    }
    callback()
  }

  // calls when processing finished of file
  _final(callback: (error?: Error | null | undefined) => void): void {}
}
