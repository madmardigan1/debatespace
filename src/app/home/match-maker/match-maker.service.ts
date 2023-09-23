import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Card, CardDataService } from 'src/app/space-service.service';
import { DebateAuthService } from '../debate-auth.service';

export interface MatchRequest {
  user: User;
  topics: string[];
  ranked: boolean;
}

@Injectable({
  providedIn: 'root'
})


export class MatchMakerService {
  
  
  private match : any;
  private topiclist = new BehaviorSubject<Card[]>([]);
  
  constructor(private cardServ: CardDataService) {
  }
  
  matchRequest(user: User, topics: string[], ranked: boolean): void {
    const newRequest: MatchRequest = {
      user: user,
      topics: topics,
      ranked: ranked
    };
    
    this.match= newRequest;
    const matchgames = this.cardServ.findMatches(topics,ranked);
    if (matchgames) {
      this.topiclist.next(matchgames);
    }
    else {
      this.cardServ.getTopics().subscribe(data => {
        const matchgames = this.cardServ.findMatches(this.match.topics,this.match.ranked)
        this.topiclist.next(matchgames);
      })
    }
      
  
  }
  
  getTopics(): Observable<Card[]> {
    return this.topiclist.asObservable();
  }
  
}
