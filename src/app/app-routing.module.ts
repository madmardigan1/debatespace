import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { TournamentBulletinComponent } from './tournament-bulletin/tournament-bulletin.component';
import { BrowsePageComponent } from './browse-page/browse-page.component';
import { DebateSpaceMobComponent } from './debate-space-mob/debate-space-mob.component';
import { TopicMenuComponent } from './home/topic-menu/topic-menu.component';
import { SearchComponent } from './search/search.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home/create' , component: SpacecreateComponent},
  { path: 'home/tournament', component: TournamentBulletinComponent},
  { path: 'browse/:topic', component: BrowsePageComponent},
  { path: 'debateMob/:id', component: DebateSpaceMobComponent},
  { path: 'home/topicMenu/:myParam', component:TopicMenuComponent},
  { path: 'home', component:HomeComponent},
  { path: 'search', component:SearchComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
