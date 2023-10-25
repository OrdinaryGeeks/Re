using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        
        private readonly QuizBowlContext _context;

        public QuestionsController(QuizBowlContext context)
        {

            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Question>>GetQuestions()
        {
            var questions = _context.Questions.ToList();

            return Ok(questions);
        }

        [HttpGet("{id}")]
        public ActionResult<Question>GetQuestion(int id)
        {
            

            return Ok( _context.Questions.Find(id));
        }
    }
}