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
        {

            




            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {


            return base.OnDisconnectedAsync(exception);
        }


        public async Task LeaveGame(string gameName, string userName, int userID)
        {


          //  Player player = _context.Players.Find(userID);
            if(gameName != null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameName);
          //  player.GameName = null;
            // await _context.SaveChangesAsync();
            await Clients.Groups(gameName).SendAsync("playerLeftGame", userName);

        }

public async Task GameCheckSignal(string gameName, string userName, int gameID)
{

    GameState game =_context.GameStates.Find(gameID);
    game.Status = "Checking";
    await _context.SaveChangesAsync();

await Clients.Groups(gameName).SendAsync("GameCheck");

}
    public async Task StartGame(string gameName)
    {

     
        await Clients.Groups(gameName).SendAsync("StartGame");
      

      
    }
        public async Task PlayerReadySignal(string gameName, int userID)
        {

            Player player = _context.Players.Find(userID);

            player.Ready = true;
            await _context.SaveChangesAsync();

            await  Clients.Groups(gameName).SendAsync("playerReady", userID);



        }
        
        public async Task PlayerNotReadySignal(string gameName, int userID)
        {

            Player player = _context.Players.Find(userID);

            player.Ready = false;
            await _context.SaveChangesAsync();

            await  Clients.Groups(gameName).SendAsync("playerNotReady");



        }
        public  async Task CreateOrJoinGame(GameState gameState,  Player player)
    {
        
        //Player player = _context.Players.Find(userID);

        //GameState game = _context.GameStates.Find(gameID);

       // if(player.GameName != null)
       // await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameName);

        await Groups.AddToGroupAsync(Context.ConnectionId, gameState.GameName);

        //player.GameName=gameName;
        //player.GameStateId = game.Id;
        //await _context.SaveChangesAsync();
        
       // Player[] listOfPlayersInGame=_context.Players.Where((gamePlayer) => gamePlayer.GameStateId == game.Id).ToArray();

        await Clients.Groups(gameState.GameName).SendAsync("playerAddedToGame", player, gameState);

    
      //  await Groups.AddToGroupAsync(Context.ConnectionId, gameName);
       // Clients.Group(gameName).SendAsync("playerAddedToGame", Context.User.Identity.Name + " joined");
        
    }

    public async Task IncrementQuestionIndex(string gameName, string userName, int gameID)
        {

            GameState game = _context.GameStates.Find(gameID);

            game.QuestionIndex++;

            await _context.SaveChangesAsync();

            await Clients.Groups(gameName).SendAsync("incrementQuestionIndex", userName, game.QuestionIndex);
            

        }
  

    public async Task GroupBuzzIn(string user, string gameName)
    {
        await Clients.Group(gameName).SendAsync("groupBuzzIn", user);
    }
 
      public async Task GroupScoreSignal(string gameName, Player player)
    {
          
       
     
        
        await Clients.Groups(gameName).SendAsync("Group Correct Answer", player);

        
    }

    public async Task GroupWinner(string user, string gameName)
    {
        await Clients.Groups(gameName).SendAsync("Winner", user);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameName);

    }

  public async Task GroupIncorrectAnswer(string user, string gameName, int userID)
    {

        Player player = _context.Players.Find(userID);
        player.Incorrect = true;
        await _context.SaveChangesAsync();
        await Clients.Groups(gameName).SendAsync("Group Incorrect Answer", user);
    }


}
}
