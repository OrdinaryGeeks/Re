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


            Player player = _context.Players.Find(userID);
            if(gameName != null)
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameName);
            player.GameName = null;
             await _context.SaveChangesAsync();
            await Clients.Groups(gameName).SendAsync("playerLeftGame", player.UserName);

        }

    public async Task StartGame(int gameID)
    {

        GameState game = _context.GameStates.Find(gameID);
        if(game.Status != "Started")
        {
        game.Status="Started";
        await _context.SaveChangesAsync();
        await Clients.Groups(game.GameName).SendAsync("StartGame");
        }

      
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
        public  async Task CreateOrJoinGame(string gameName,  string userName, int userID, int gameID)
    {
        
        Player player = _context.Players.Find(userID);

        GameState game = _context.GameStates.Find(gameID);

        if(player.GameName != null)
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, player.GameName);

        await Groups.AddToGroupAsync(Context.ConnectionId, gameName);

        player.GameName=gameName;

        await _context.SaveChangesAsync();
        

        await Clients.Groups(gameName).SendAsync("playerAddedToGame", userName, game.QuestionIndex);

    
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
 
      public async Task GroupCorrectAnswer(string gameName, int score, int userID, int gameID)
    {
        Player player = _context.Players.Find(userID);
        player.Score += score;
         GameState game = _context.GameStates.Find(gameID);

            game.QuestionIndex++;

       
        await _context.SaveChangesAsync();


      
     
        
        await Clients.Groups(gameName).SendAsync("Group Correct Answer", game.QuestionIndex);

        
    }

    public async Task GroupWinner(string user, string gameName)
    {
        await Clients.Groups(gameName).SendAsync("Winner", user);
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
