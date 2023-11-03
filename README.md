### Quiz Bowl

## Ordinary Geeks React SignalR Asp.Net Core Identity JWT tokens React Redux Toolkit

This project uses signalR websockets and a react front end to simulate a simple quiz game. It is in early stages but is approcahing beta status.

# How to traverse the website

- Go to https://www.ordinarygeeks.com and register. The name you sign up to the Identity back end will be your username that other people see when you join games. In the lobby, you have to get your player handle (username) that you signed up with. You then have an option to create a game yourself or to join someone else's game, (if there are any extra games).

- In the game you and opponents, (which can also be you if you open up two tabs), can answer questions to score points. A buzz in will block your opponent but the timer is not working to unbuzz someone so.
  <strike> After that you will be marked as having given an incorrect answer and will not be able to buzz in again.</strike>

- Any player can skip to the next question.

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

- Persist information instead of local storage

#CODE

The quizbowl is kind of heavy. The signalR example I used triggers events that can cause dependency rerenders. Also had instances of stale state that needed an update to show. Walked away from a timer for the time being.

In Quizbowl the important events precede the function that calls them. I also tried to order them by logical execution in the signalRConnection file and quizbowl.
