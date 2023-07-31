import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatSpaceComponent } from './chat-space/chat-space.component';
import { GptSummaryComponent } from './gpt-summary/gpt-summary.component';
import { ChatSubmitComponent } from './chat-submit/chat-submit.component';
import { NodeSpaceComponent } from './node-space/node-space.component';

//materials
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SharedserviceService } from './sharedservice.service';
//node


@NgModule({
  declarations: [
    AppComponent,
    ChatSpaceComponent,
    GptSummaryComponent,
    ChatSubmitComponent,
    NodeSpaceComponent,
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule 
  ],
  providers: [SharedserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
