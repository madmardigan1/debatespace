import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatSpaceComponent } from './debate-space/chat-space/chat-space.component';
import { GptSummaryComponent } from './debate-space/gpt-summary/gpt-summary.component';
import { ChatSubmitComponent } from './debate-space/chat-submit/chat-submit.component';
import { NodeSpaceComponent } from './debate-space/node-space/node-space.component';

//materials
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { SharedserviceService } from './sharedservice.service';
import { DebateSpaceComponent } from './debate-space/debate-space.component';
import { ActivespaceComponent } from './activespace/activespace.component';
import { CardDataComponent } from './card-data/card-data.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//node


@NgModule({
  declarations: [
    AppComponent,
    ChatSpaceComponent,
    GptSummaryComponent,
    ChatSubmitComponent,
    NodeSpaceComponent,
    DebateSpaceComponent,
    ActivespaceComponent,
    CardDataComponent,
    CardDetailsComponent,
    HomeComponent,
    SpacecreateComponent,
    
    

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatToolbarModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [SharedserviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
