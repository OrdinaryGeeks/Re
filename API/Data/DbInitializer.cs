

using API.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(QuizBowlContext context, UserManager<User> userManager)
        {


            if(!userManager.Users.Any())
            {
                var user = new User{
                    UserName="user1",
                    Email="user1@user1.com"
                };

                 await userManager.CreateAsync(user, "CrazyPa$$12");
                await userManager.AddToRoleAsync(user, "Member");


                var admin = new User{
                    UserName="admin1",
                    Email="admin1@admin1.com"
                };

                await userManager.CreateAsync(admin, "CrazyPa$$12");
                await userManager.AddToRolesAsync(admin, new[] {"Member","Admin"});

            }


            if(context.Questions.Any())
            return;

            var questions = new List<Question>{

                new Question{
                    Text="Who is the leader of the Greek Gods",
                    Answer="Zeus",
                    Points=100,
                    Category="Greek Mythology"
                },
                new Question{
                    Text="Last name of the person who invented basketball",
                    Answer="Naismith",
                    Points=200,
                    Category="Sports"
                },
                new Question{
                    Text="What is the name of the main character in the movie Matrix",
                    Answer="Neo",
                    Points=100,
                    Category="Movies"
                },
                new Question{
                    Text="Name the ninja turtle with the orange headband who uses nunchucks",
                    Answer="Michaelangelo",
                    Points=200,
                    Category="Comic Books"
                }
            };

            foreach(var question in questions)
            {
                context.Questions.Add(question);
            }

            context.SaveChanges();










            }
        }
    }
