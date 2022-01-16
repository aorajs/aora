/// <reference types="node" />
import { Readable } from 'stream';
declare class StringToStream extends Readable {
    constructor(str: string);
    _read(): void;
}
declare function mergeStream2(...arg: any[]): Readable;
export { StringToStream, mergeStream2 };
//# sourceMappingURL=string-stream.d.ts.map