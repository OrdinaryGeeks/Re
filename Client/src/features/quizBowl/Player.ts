export interface Player {
  id: number;
  userName: string;
  score: number;
  email: string;
  gameStateId: number | null;
  ready: boolean;
  nextQuestion: boolean;
  gameName: string | null;
  incorrect: boolean;
  gamesJoined: string;
}
