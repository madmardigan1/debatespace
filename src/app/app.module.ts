import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TournamentBulletinComponent } from './tournament-bulletin/tournament-bulletin.component';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { DebateSpaceMobComponent } from './debate-space-mob/debate-space-mob.component';
import { ChatSpaceMobComponent } from './debate-space-mob/chat-space-mob/chat-space-mob.component';
import { ChatSubmitMobComponent } from './debate-space-mob/chat-submit-mob/chat-submit-mob.component';
import { UserSummaryMobComponent } from './debate-space-mob/user-summary-mob/user-summary-mob.component';
import { NodeSpaceMobComponent } from './debate-space-mob/node-space-mob/node-space-mob.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AvControlMobComponent } from './debate-space-mob/av-control-mob/av-control-mob.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { TopicMenuComponent } from './home/topic-menu/topic-menu.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { UserCardComponent } from './debate-space-mob/user-summary-mob/user-card/user-card.component';
import { AboutNodesComponent } from './home/about-nodes/about-nodes.component';
import { ReportFormComponent } from './debate-space-mob/report-form/report-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SearchComponent } from './search/search.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NodesComponent } from './nodes/nodes.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SpacecreateComponent,
    TournamentBulletinComponent,
    BrowsePageComponent,
    DebateSpaceMobComponent,
    ChatSpaceMobComponent,
    ChatSubmitMobComponent,
    UserSummaryMobComponent,
    NodeSpaceMobComponent,
    AvControlMobComponent,
    LeaderboardComponent,
    TopicMenuComponent,
    UserSearchComponent,
    UserCardComponent,
    AboutNodesComponent,
    ReportFormComponent,
    SearchComponent,
    NodesComponent,
 
    
  ],
  imports: [

    MatDialogModule,
    MatSnackBarModule,
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
    NgbModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
