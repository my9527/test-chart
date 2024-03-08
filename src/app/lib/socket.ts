
import { v4 as uuidv4 } from 'uuid';
import { sleep } from './sleep';


type EventRecord = {
    id: string,
    cb: AnyFunc
}


export class BaseSocket {

    connection: WebSocket | null = null;
    url: string;

    connected: boolean = false;


    // 监听事件
    _events: Record<keyof WebSocketEventMap, EventRecord[]> = { 
        open: [],
        message: [],
        close: [],
        error: [],
    };


    constructor(url_: string, autoConnect:boolean = false) {
        this.url = url_;
        if(autoConnect) {
            this.connect();
        }

        

    }

    connect = async () => {
        this.connection = new WebSocket(this.url);

        // this.bind("message",)
        this.connection.addEventListener("open", this._open);
        this.connection.addEventListener("message", this._message);
    }


    _open = (evt: Event) => {
        console.log("connected");
        this.connected = true;
    }


    _message = (evt: Event) => {
        this._events["message"].forEach(({ cb }) => {
            cb(evt);
        });
    }

    bind(type: keyof WebSocketEventMap, cb: AnyFunc, options?: any): string {
        // this.connection?.addEventListener('close', )
        this.connection?.addEventListener(type, cb, options);

        // const _uid = this.bind('message', cb);
        const _uid = uuidv4();


        this._events["message"].push({
            id: _uid,
            cb: cb,
        });

        //
        return _uid;

    }

    unbind(type: keyof WebSocketEventMap, cb: AnyFunc) {
        this.connection?.removeEventListener(type, cb);
        const _listener = this._events[type].filter(v => v.cb !== cb);
        this._events[type] = _listener;
    };


    disconnect = async () => {
        // this.unbind();
        await this.connection?.close();
        this.connection = null;
    }


    unsubscribe(topic: string, params: {[key: string]: any} = {}, sid?: string) {

        this._send({
            event: 'unsubscribe',
            channel: topic,
            // param: params,
            ...params,
        });


        // const cb = this._events
        if(sid){
            const eventTypes = Object.keys(this._events) as  Array<keyof WebSocketEventMap> ;
            for(let t of eventTypes) {
                const targetEvent = this._events[t].filter(_t => _t.id === sid);
                if(targetEvent.length > 0){
                    this.unbind(t, targetEvent[0].cb)
                }
            }
        }
    }

    //  event: 'unsubscribe', channel: 'change', param: previousInterval 

    subscribe(topic: string, params: AnyObjec = {}, cb?: AnyFunc): string | undefined {

        this._send({
            event: 'subscribe',
            channel: topic,
            // param: params,
            ...params,
        });

        if(cb) {
            return this.bind('message', cb);
        }   

    }


    async _send(msg: {[k: string]: any}): Promise<any> {

        if(!this.connected) {
            await sleep(50);
            return this._send(msg);
        }
        this.connection?.send(JSON.stringify(msg))
    }


}