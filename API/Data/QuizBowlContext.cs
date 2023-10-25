
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class QuizBowlContext : DbContext
    {
        public QuizBowlContext(DbContextOptions options):base(options)
        {

        }

        public DbSet<Question> Questions{get;set;}
    }
}