using API.Data;
using API.Models;
using Azure;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Hubs
{
    public class QuizHub: Hub
{

     QuizBowlContext _context;
    public QuizHub(QuizBowlContext context)
    {
            _context = context;
        
    }

        public override Task OnConnectedAsync()
        {return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        { return base.OnDisconnectedAsync(exception);
        }

//Believe this is umused implementation
        public async Task LeaveGame(string gameName, string userName, int userID)
        {


            if(gameName != null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameName);
         
            await Clients.Groups(gameName).SendAsync("playerLeftGame", userName);

        }


//unused implementation
public async Task GameCheckSignal(string gameName, string userName, int gameID)
{

    GameState game =_context.GameStates.Find(gameID);
    game.Status = "Checking";
    await _context.SaveChangesAsync();

await Clients.Groups(gameName).SendAsync("GameCheck");

}

//send group start message
    public async Task StartGame(string gameName)
    {
        await Clients.Groups(gameName).SendAsync("StartGame", gameName);
    }

    //unused implementation
        public async Task PlayerReadySignal(string gameName, int userID)
        {

            Player player = _context.Players.Find(userID);

            player.Ready = true;
            await _context.SaveChangesAsync();

            await  Clients.Groups(gameName).SendAsync("playerReady", userID);



        }


        //unused implementation
        public async Task PlayerNotReadySignal(string gameName, int userID)
        {

            Player player = _context.Players.Find(userID);

            player.Ready = false;
            await _context.SaveChangesAsync();

            await  Clients.Groups(gameName).SendAsync("playerNotReady");



        }
        public  async Task CreateOrJoinGame(GameState gameState,  Player player)
    {
         

         string[] playerJoinedGames = player.GamesJoined.Split(";");

         foreach(var joinedGame in playerJoinedGames)
         {
         await Groups.RemoveFromGroupAsync(Context.ConnectionId, joinedGame);
         }

        await Groups.AddToGroupAsync(Context.ConnectionId, gameState.GameName);
         player.GamesJoined = gameState.GameName+";";
         await Clients.Groups(gameState.GameName).SendAsync("playerAddedToGame", player, gameState);
        // await Groups.AddToGroupAsync(Context.ConnectionId, gameState.GameName);
         
         

        
      //  await Clients.Groups(gameState.GameName).SendAsync("playerAddedToGame", player, gameState);

    }


//option to go to the next question. store the questionindex on the server?? cant remember why i didnt take
//this out but its late and im posting this code
    public async Task IncrementQuestionIndex(string gameName, Player player, int gameID)
        {

            GameState game = _context.GameStates.Find(gameID);

            game.QuestionIndex++;

            await _context.SaveChangesAsync();

            await Clients.Groups(gameName).SendAsync("incrementQuestionIndex", player, game.QuestionIndex);
            

        }
  

//set the buzzin event and user so that only one person can enter an answer at a time
    public async Task GroupBuzzIn(string user, string gameName)
    {
        await Clients.Group(gameName).SendAsync("groupBuzzIn", user);
    }
 

 //used to send a score signal with accompanying lucky player for updates.
 //program uses a static update for the usersingame array
      public async Task GroupScoreSignal(string gameName, Player player)
    {
          
       
     
        
        await Clients.Groups(gameName).SendAsync("Group Correct Answer", player);

        
    }


  
    //Fired once a winner is crowned and disconnects everyone from the gameName and sends corresponding message
    public async Task GroupWinner(Player player, GameState gameState)
    {
        await Clients.Groups(gameState.GameName).SendAsync("Winner", player, gameState);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameState.GameName);

    }

  public async Task GroupIncorrectAnswer(Player player, string gameName)
    {

    
        await Clients.Groups(gameName).SendAsync("Group Incorrect Answer", player);
    }


}
}
