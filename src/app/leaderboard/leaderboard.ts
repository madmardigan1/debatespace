export interface Leaderboard {
    user: string;
    totalPoints: number;
    seasonPoints: number;
    weeklyPoints: number;
    [key: string]: string | number; // Add this line
}
