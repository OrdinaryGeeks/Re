using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;

namespace API.Controllers
{
  [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly QuizBowlContext _context;

        public PlayersController(QuizBowlContext context)
        {
            _context = context;
        }

        // GET: api/Players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers()
        {
            return await _context.Players.ToListAsync();
        }

        // GET: api/Players/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Player>> GetPlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);

            if (player == null)
            {
                return NotFound();
            }

            return player;
        }


        [HttpGet("playerFinishedGame/{id}")]
        public async Task<ActionResult<Player>> PlayerFinishedGame(int id){

                if(!PlayerExists(id))
                {
                    return NotFound();
                }

                Player player = _context.Players.Find(id);
                player.Score = 0; 
                player.GameName = "";
                player.GameStateId=null;
                player.Incorrect = false;
                player.NextQuestion = false;
                player.Ready = false;
                
                _context.Entry(player).State = EntityState.Modified;

                   try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return player;
        }

        


      
        // PUT: api/Players/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlayer(int id, Player player)
        {
            if (id != player.Id)
            {
                return BadRequest();
            }

            _context.Entry(player).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost("CreateIfNotExists")]
        public async Task<ActionResult<Player>> CreateIfNotExists(Player userPlayer)
        {
            if(PlayerNameExists(userPlayer.UserName))
            return _context.Players.Where(x => x.UserName == userPlayer.UserName).First();

            Player player = new Player(){UserName=userPlayer.UserName, Email =userPlayer.Email, Score=userPlayer.Score, GameStateId=null};
            _context.Players.Add(player);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetPlayer", new { id = player.Id }, player);

        }
        // POST: api/Players
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Player>> PostPlayer(Player player)
        {

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlayer", new { id = player.Id }, player);
        }

        // DELETE: api/Players/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null)
            {
                return NotFound();
            }

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlayerNameExists(string userName)
        {

            return _context.Players.Any(e => e.UserName == userName);
        }
        private bool PlayerExists(int id)
        {
            return _context.Players.Any(e => e.Id == id);
        }
    }
}
