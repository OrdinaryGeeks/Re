
using API.Models;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class QuizBowlContext : IdentityDbContext<User>
    {
        public QuizBowlContext(DbContextOptions options):base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>().HasData(new IdentityRole{Name="Member", NormalizedName="MEMBER"},
            new IdentityRole{Name="Admin", NormalizedName="ADMIN"});

        }
        public DbSet<Question> Questions{get;set;}

        public DbSet<Player> Players{get;set;}

        public DbSet<GameState> GameStates{get;set;}
    }
}