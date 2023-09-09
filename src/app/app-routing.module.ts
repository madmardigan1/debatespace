import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardDetailsComponent } from './card-details/card-details.component';
import { HomeComponent } from './home/home.component';
import { SpacecreateComponent } from './spacecreate/spacecreate.component';
import { DebateSpaceComponent } from './debate-space/debate-space.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card-details/:id', component: CardDetailsComponent },
  { path: 'create' , component: SpacecreateComponent},
  { path: 'debate/:id', component: DebateSpaceComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
