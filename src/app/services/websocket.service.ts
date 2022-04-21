import { Injectable } from "@angular/core";
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from "@amcharts/amcharts5/.internal/core/util/List";

const WS_URL = "ws://api-2207.bs-soft.co.kr/ws";
// const WS_URL = "ws://0.0.0.0:8000/ws";

export interface Message {
    source: string;
    content: string;
}

export interface requestMessage {
    cmd: string;
    args: string[];
}

@Injectable()
export class WebsocketService {
    private subject: AnonymousSubject<MessageEvent>;
    public messages: Subject<Message>;
    public requestmessages: Subject<requestMessage>;

    constructor() {
        this.messages = <Subject<Message>>this.connect(WS_URL).pipe(
            map(
                (response: MessageEvent): Message => {
                    // console.log(response.data);
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );

        this.requestmessages = <Subject<requestMessage>>this.connect(WS_URL).pipe(
            map(
                (response: MessageEvent): requestMessage => {
                    // console.log(response.data);
                    let data = JSON.parse(response.data)
                    return data;
                }
            )
        );


    }

    public connect(url): AnonymousSubject<MessageEvent> {
        if (!this.subject) {
            this.subject = this.create(url);
            console.log("Successfully connected: " + url);
        }
        return this.subject;
    }

    private create(url): AnonymousSubject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable = new Observable((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            error: null,
            complete: null,
            next: (data: Object) => {
                // console.log('Message sent to websocket: ', data);
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        return new AnonymousSubject<MessageEvent>(observer, observable);
    }
}