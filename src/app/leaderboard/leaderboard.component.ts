import { Component } from '@angular/core';
import { Leaderboard } from './leaderboard';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
selectedButton = 1;
points = "totalPoints";
leader : Leaderboard []= [
  {user: "Jared", totalPoints: 10, seasonPoints:30, weeklyPoints:2},
  {user: "Steve", totalPoints: 20, seasonPoints:10, weeklyPoints:0}
];
toggle (data:number):void {
this.sortLeaderboardBy

}

sortLeaderboardBy(field: 'totalPoints' | 'seasonPoints'|'weeklyPoints') {
  this.leader= this.leader.sort((a, b) => b[field] - a[field]);
  this.points=field;
  // For descending order
  // Use the following line instead if you want ascending order:
  // return leaderboard.sort((a, b) => a[field] - b[field]);
}


}
