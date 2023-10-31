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

    public  async Task CreateOrJoinGame(string gameName,  string userName)
    {
        

        await Groups.AddToGroupAsync(Context.ConnectionId, gameName);
        
        await Clients.Groups(gameName).SendAsync("playerAddedToGame", userName);

      //  await Groups.AddToGroupAsync(Context.ConnectionId, gameName);
       // Clients.Group(gameName).SendAsync("playerAddedToGame", Context.User.Identity.Name + " joined");
        
    }

    public async Task IncrementQuestionIndex(string gameName, string userName)
        {
            await Clients.Groups(gameName).SendAsync("incrementQuestionIndex", userName);


        }
    public async Task NewMessage(string user, string message)
    {
        
        await Clients.All.SendAsync("messageReceived", user, message);
    }

    public async Task GroupBuzzIn(string user, string gameName)
    {
        await Clients.Group(gameName).SendAsync("groupBuzzIn", user);
    }
    public async Task BuzzIn(string user)
    {
        await Clients.All.SendAsync("GroupBuzzIn", user);
    }

      public async Task GroupCorrectAnswer(string user, string gameName, int score)
    {
        await Clients.Groups(gameName).SendAsync("Group Correct Answer", user, score);
    }

  public async Task GroupIncorrectAnswer(string user, string gameName)
    {
        await Clients.Groups(gameName).SendAsync("Group Incorrect Answer", user);
    }


    public async Task CorrectAnswer(string user, int score)
    {
        await Clients.All.SendAsync("Correct Answer", user, score);
    }
}
}
