import { Component } from '@angular/core';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.css']
})

export class UserSummaryComponent {
  public selectedPhoto!: string;
  public selectedName!: string;
  selectedMoment!: number;
  panelReveal = false;

  public users = [
    { name: 'Steve', role: 'host', moment: 300, photoUrl: 'assets/Steve1.jpeg' },
    { name: 'Jared', role: 'speaker', moment: 5, photoUrl: 'assets/Jared.jpeg' },
    // ... add more users as needed
  ];

  closePanel() {
    // Your logic here
  }

  getDetails(user: any) {
    // Your logic here
  }

  getUsersByRole(role: string) {
    return this.users.filter(u => u.role === role);
  }
}
