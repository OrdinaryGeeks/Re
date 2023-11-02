### Quiz Bowl

## Ordinary Geeks React SignalR Asp.Net Core Identity JWT tokens React Redux Toolkit

This project uses signalR websockets and a react front end to simulate a simple quiz game. It is in early stages but is approcahing beta status.

# How to traverse the website

- Go to https://www.ordinarygeeks.com and register. The name you sign up to the Identity back end will be your username that other people see when you join games. In the lobby, you have to get your player handle (username) that you signed up with. You then have an option to create a game yourself or to join someone else's game, (if there are any extra games).

- In the game you and an opponent, (that opponent can also be you if you open up two tabs), can answer questions to score points. A buzz in will block your opponent from buzzing in for 5 seconds. After that you will be marked as having given an incorrect answer and will not be able to buzz in again.

- Either player can skip to the next question.

# TO DO

<strike>
- Synchronize the question index

- Move all state logic to Redux Tool Kit

- End game once points limit reached and declare winner

- Track which games users join so that they can be removed from the signalR groups when they join a new game or disconnect
  </strike>

- Add Timer back

- Prettify

- Build front end tools to add questions/answers
