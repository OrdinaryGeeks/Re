

using API.Models;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(QuizBowlContext context)
        {
            if(context.Questions.Any())
            return;

            var questions = new List<Question>{

                new Question{
                    Text="Who is the leader of the Greek Gods",
                    Answer="Zues",
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
