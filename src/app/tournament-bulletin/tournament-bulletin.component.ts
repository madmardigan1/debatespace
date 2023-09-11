import { Component } from '@angular/core';

@Component({
  selector: 'app-tournament-bulletin',
  templateUrl: './tournament-bulletin.component.html',
  styleUrls: ['./tournament-bulletin.component.css']
})
export class TournamentBulletinComponent {
  tournaments: { date: Date, name: string }[] = [
    { date: new Date(2023, 10, 12), name: 'Topic: Climate Change' },
    // ... add other tournaments
  ];

  constructor() { }

  getUpcomingTournaments(): { date: Date, name: string }[] {
    // For a real-world app, you might fetch this data from an API
    return this.tournaments;
  }
}
