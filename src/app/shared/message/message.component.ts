import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-message',
  template: `
    <p-message *ngIf="temErro()" class="p-message-error"
               severity="error"
               [text]="text" >
    </p-message>
  `,
  styles: [`
    .p-message-error {
    padding: 3px;
    }
  `]
})
export class MessageComponent{

  @Input() error: string = '';
  @Input() control: any;
  @Input() text: string = '';

  temErro() : boolean {
    return this.control.hasError(this.error) && this.control.dirty;
  }

}
