using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Models;
using System.Collections;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly QuizBowlContext _context;

        public GamesController(QuizBowlContext context)
        {
            _context = context;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameState>>> GetGameStates()
        {
            return await _context.GameStates.ToListAsync();
        }


        [HttpGet("lobby")]
            public async Task<ActionResult<IEnumerable<GameState>>> GetGameState()
        {
          return   await _context.GameStates.Where(gameS => gameS.Status.ToLower() == "lobby").ToListAsync();

            
        }


        // GET: api/Games/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameState>> GetGameState(int id)
        {
            var gameState = await _context.GameStates.FindAsync(id);

            if (gameState == null)
            {
                return NotFound();
            }

            return gameState;
        }

        // PUT: api/Games/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameState(int id, GameState gameState)
        {
            if (id != gameState.Id)
            {
                return BadRequest();
            }

            _context.Entry(gameState).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameStateExists(id))
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
        
        [HttpGet("usersInGame/{id}")]
        public  IEnumerable<Player> GetUsersInGame(int id)
        {

            return  _context.Players.Where(player => player.GameStateId == id).ToList();
        }
        // POST: api/Games
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GameState>> PostGameState(GameState gameState)
        {

            

            if(_context.GameStates.Any(inDBGameState => (inDBGameState.GameName == gameState.GameName)))
            {
            GameState errorGameState = new GameState{GameName="Duplicate Game Created", Id=-1, MaxPlayers=0, QuestionIndex=0, ScoreToWin=0, Status="Dupe"};
            return CreatedAtAction("PostGameState", new {gameName = "Duplicate Game Created"}, errorGameState);

            }


            _context.GameStates.Add(gameState);
            await _context.SaveChangesAsync();

            return CreatedAtAction("PostGameState", new { id = gameState.Id }, gameState);
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameState(int id)
        {
            var gameState = await _context.GameStates.FindAsync(id);
            if (gameState == null)
            {
                return NotFound();
            }

            _context.GameStates.Remove(gameState);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameStateExists(int id)
        {
            return _context.GameStates.Any(e => e.Id == id);
        }
    }
}