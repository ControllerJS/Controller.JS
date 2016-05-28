
declare module 'gbxremote' {
  import EventEmitter = NodeJS.EventEmitter;
  export interface Gbx extends EventEmitter {
    createClient (port: number, address: string) : Gbx;

    query (name: string, params?: any[]): Promise<any>;
  }
}
