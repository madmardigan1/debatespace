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
import { MatButton } from '@angular/material/button';
import { SharedserviceService } from './sharedservice.service';
import { DebateSpaceComponent } from './debate-space/debate-space.component';
import { ActivespaceComponent } from './activespace/activespace.component';
import { CardDataComponent } from './card-data/card-data.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSummaryComponent } from './debate-space/user-summary/user-summary.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TournamentBulletinComponent } from './tournament-bulletin/tournament-bulletin.component';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { DebateSpaceMobComponent } from './debate-space-mob/debate-space-mob.component';
import { ChatSpaceMobComponent } from './debate-space-mob/chat-space-mob/chat-space-mob.component';
import { ChatSubmitMobComponent } from './debate-space-mob/chat-submit-mob/chat-submit-mob.component';
import { UserSummaryMobComponent } from './debate-space-mob/user-summary-mob/user-summary-mob.component';
import { NodeSpaceMobComponent } from './debate-space-mob/node-space-mob/node-space-mob.component';
import { GptsummaryMobComponent } from './debate-space-mob/gptsummary-mob/gptsummary-mob.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AvControlMobComponent } from './debate-space-mob/av-control-mob/av-control-mob.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TopicMenuComponent } from './home/topic-menu/topic-menu.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserCardComponent } from './debate-space-mob/user-summary-mob/user-card/user-card.component';

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
    UserSummaryComponent,
    TournamentBulletinComponent,
    BrowsePageComponent,
    DebateSpaceMobComponent,
    ChatSpaceMobComponent,
    ChatSubmitMobComponent,
    UserSummaryMobComponent,
    NodeSpaceMobComponent,
    GptsummaryMobComponent,
    AvControlMobComponent,
    LeaderboardComponent,
    TopicMenuComponent,
    UserSearchComponent,
    UserCardComponent,


    
    

  ],
  imports: [
    MatMenuModule,
    MatSlideToggleModule,
    MatTabsModule,
    FontAwesomeModule,
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
