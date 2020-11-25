import {Command, flags} from '@oclif/command'
import {parse, NODE_STREAM_INPUT} from 'papaparse';
import * as fs from 'fs';

class Csvcli extends Command {
  static description = 'reads a csv and prints it out nicely formatted'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Csvcli)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from ./src/index.ts`)
    if (args.file) {
      const parseStream = parse(NODE_STREAM_INPUT);
      let data: Array<Array<string>> = [];
      parseStream.on("data", (chunk: Array<string>) => {
          data.push(chunk);
      });
      let objects: any = []
      parseStream.on("finish", () => {
          const headers = data.shift() ?? []
          data.forEach((element: Array<string>) => {
            var obj = {} as CsvRow;
            headers.forEach((key: string, i: number) => obj[key] = element[i]);
            objects.push(obj);
          });
          console.log(objects);
      });
      fs.createReadStream(args.file).pipe(parseStream);
    }
  }
}

type CsvRow = {
  [key: string]: any;

  Date: string
  High_Temp: string
  Low_Temp: string
  Avg_Temp: string
  Precipitation: string

}

export = Csvcli
