import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

//metrics for each user..consider adding more later
export interface User {
  name: string;
  role: string;
  rank: number;
  photoUrl: string;
}

//data for each Node that gets created
export interface Card {
  id: string;
  user: User[]; // The main user
  topic: string[];
  description: string;
  ranked: boolean;
}

export interface Topic {
  name: string;
  tally: number;
}

//arrary to contain all topics generated.  Any user created topic is added to the usertopics section...This should get sorted manually later.
export interface Topics {
  usertopics: Topic[];
  politics: Topic[];
  technology: Topic[];
  science: Topic[];
  sports: Topic[];
  environment: Topic[];
  economy: Topic[];
  arts: Topic[];
  lifestyle: Topic[];
  travel: Topic[];
  health: Topic[];
  [key: string]: Topic[];
}


@Injectable({
  providedIn: 'root'
})

export class CardDataService {
  private cards = new BehaviorSubject<Card[]>([
    {
      id: '1', 
      user: [
        {name: 'Steve', role: 'host', rank: 1, photoUrl: '/assets/Steve.jpeg'},
        {name: 'Jared', role: 'speaker', rank: 2, photoUrl: '/assets/Jared.jpeg'},
        {name: 'Jared', role: 'speaker', rank: 2, photoUrl: '/assets/Jared.jpeg'},
        {name: 'Jared', role: 'speaker', rank: 2, photoUrl: '/assets/Jared.jpeg'},
        {name: 'Jared', role: 'spectator', rank: 2, photoUrl: '/assets/Jared.jpeg'}
      ],
      topic: ["Politics", "Ukraine", "Corruption", "Trump", "War"], 
      description: "Follow me for the latest updates on Ukraine.  We're digging deep into recent government corruption", 
      ranked: true
    },
    {
      id: '2', 
      user: [
        {name: 'Steve', role: 'host', rank: 1, photoUrl: '/assets/Steve.jpeg'},
        {name: 'Jared', role: 'speaker', rank: 2, photoUrl: '/assets/Jared.jpeg'}
      ], 
      topic: ["Technology", "AI", "Innovation"], 
      description: "Latest breakthroughs in AI", 
      ranked: true
    },
    {
      id: '3', 
      user: [
        {name: 'Steve', role: 'host', rank: 1, photoUrl: '/assets/Steve.jpeg'},
        {name: 'Jared', role: 'speaker', rank: 2, photoUrl: '/assets/Jared.jpeg'}
      ], 
      topic: ["Science", "Space", "Mars"], 
      description: "Mars rover finds something interesting", 
      ranked: true
    },
    // ... Continue in this manner for at least 8 lines.
  ]);

  private topicsInstance = new BehaviorSubject<Topics>({
    usertopics: [
      { name: "Topic1", tally: 5 },
      { name: "Topic2", tally: 7 },
    ],
    politics: [
      { name: "Ukraine", tally: 10 },
      { name: "US", tally: 22 },
      { name: "Brexit", tally: 15 },
      { name: "Asia Pacific", tally: 9 },
    ],
    technology: [
      { name: "AI", tally: 50 },
      { name: "Quantum", tally: 30 },
      { name: "5G", tally: 25 },
      { name: "Security", tally: 45 },
    ],
    science: [
      { name: "Mars", tally: 20 },
      { name: "Vaccines", tally: 32 },
      { name: "Physics", tally: 15 },
      { name: "Environment", tally: 18 },
    ],
    sports: [
      { name: "Olympics", tally: 25 },
      { name: "World Cup", tally: 30 },
      { name: "NBA", tally: 27 },
      { name: "Tennis", tally: 21 },
    ],
    environment: [
      { name: "Climate", tally: 30 },
      { name: "Energy", tally: 28 },
      { name: "Wildlife", tally: 18 },
      { name: "Oceans", tally: 24 },
    ],
    economy: [
      { name: "Markets", tally: 40 },
      { name: "Jobs", tally: 35 },
      { name: "Real Estate", tally: 33 },
      { name: "Stocks", tally: 42 },
    ],
    arts: [
      { name: "Gallery", tally: 15 },
      { name: "Movies", tally: 22 },
      { name: "Music", tally: 20 },
      { name: "Theatre", tally: 18 },
    ],
    lifestyle: [
      { name: "Fashion", tally: 22 },
      { name: "Food", tally: 28 },
      { name: "Fitness", tally: 19 },
      { name: "Wellness", tally: 21 },
    ],
    travel: [
      { name: "Destinations", tally: 35 },
      { name: "Hacks", tally: 29 },
      { name: "Adventure", tally: 27 },
      { name: "Culture", tally: 23 },
    ],
    health: [
      { name: "Diet", tally: 28 },
      { name: "Mental", tally: 26 },
      { name: "Resources", tally: 24 },
      { name: "Innovations", tally: 20 },
    ]
});

getcards(): Observable<Card[]> {
  return this.cards.asObservable();
}
  cards$ = this.cards.asObservable();

  addCard(card: Card) {
    const currentCards = this.cards.getValue();
    this.cards.next([...currentCards, card]);
   
    // Here, operate on 'currentCards' directly after updating it

}

updateCard(id: string, name:string, role:string,rank:number, photoUrl:string): void {
  const updatedCards = this.cards.getValue().map(card => {
    if (card.id === id) {
      card.user.push({
        name: name,
        role: role,
        rank: rank,
        photoUrl: photoUrl
      });

      return {
        ...card,
        
      };
    }
    return card;
  });
  this.cards.next(updatedCards);
}



addTag(newTagNames: string[]): void {
  const currentTopics = this.topicsInstance.getValue();

  for (let newTagName of newTagNames) {
    let tagFound = false; // To track if we found the tag in any category

    // Iterate over each category to search for the tag
    for (let category in currentTopics) {
      const existingTag = currentTopics[category].find(tag => tag.name === newTagName);

      if (existingTag) {
        existingTag.tally += 1;
        tagFound = true;
        break; // Break the inner loop as we've found the tag
      }
    }

    // If the tag wasn't found in any category, add it to 'usertopics' with a tally of 1
    if (!tagFound) {
      currentTopics.usertopics.push({ name: newTagName, tally: 1 });
    }
  }

  // Update the BehaviorSubject with the modified topics data
  this.topicsInstance.next(currentTopics);
}


getTopics(): Observable<Topics> {
  return this.topicsInstance.asObservable();
}

findMatches(userTopics: string[], userRanked: boolean): Card[] {
  // Extract the current cards from the BehaviorSubject
  const allCards = this.cards.getValue();

  // Filter cards that match the user's criteria
  const matchedCards = allCards.filter(card => {
    // Check if at least one topic matches
    const hasCommonTopic = card.topic.some(topic => userTopics.includes(topic));
    
    // Check if the ranked type matches
    const hasSameRankType = card.ranked === userRanked;

    return hasCommonTopic && hasSameRankType;
  });

  return matchedCards;
}


}

