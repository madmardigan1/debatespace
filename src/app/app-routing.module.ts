import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDetailsComponent } from './card-details/card-details.component';
import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { DebateSpaceComponent } from './debate-space/debate-space.component';
import { TournamentBulletinComponent } from './tournament-bulletin/tournament-bulletin.component';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { DebateSpaceMobComponent } from './debate-space-mob/debate-space-mob.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  { path: 'create' , component: SpacecreateComponent},
  { path: 'debate/:id', component: DebateSpaceComponent},
  { path: 'tournament', component: TournamentBulletinComponent},
  { path: 'browse', component: BrowsePageComponent},
  { path: 'debateMob/:id', component: DebateSpaceMobComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
