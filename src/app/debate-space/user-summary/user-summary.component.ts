import { Component } from '@angular/core';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css']
})

export class UserSummaryComponent {
  public selectedPhoto!: string;
  public selectedName!: string;
  panelReveal = false;
 public users = [
    { name: 'Steve', role: 'host', photoUrl: 'assets/Steve1.jpeg' },
    { name: 'Jared', role: 'speaker', photoUrl: 'assets/Jared.jpeg' },
    // ... add more users as needed
  ];
  getdetails(user: {name: string, photoUrl: string}) {
    this.panelReveal = true;
    this.selectedName = user.name;
    this.selectedPhoto = user.photoUrl;
  }
}
