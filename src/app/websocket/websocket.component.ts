import { Component } from '@angular/core';
import { WebsocketService } from "../services/websocket.service";

@Component({
  selector: "app-root",
  templateUrl: "./websocket.component.html",
  styleUrls: ["./websocket.component.css"],
  providers: [WebsocketService]
})

export class WebsocketComponent {
  title = 'socketrv';
  content = '';
  received = [];
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe(msg => {
      this.received.push(msg);
      console.log("Response from websocket: ", msg);

    });
  }

  sendMsg() {
    let message = {
      source: '',
      content: ''
    };
    message.source = 'localhost';
    message.content = this.content;

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }


  requestMsg() {
    let requestmessage = { cmd: "main", args: ["test"] }
    this.sent.push(requestmessage);
    this.WebsocketService.requestmessages.next(requestmessage);
  }

  ngOnInit() {

  }
}
