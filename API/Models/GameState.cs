using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class GameState
    {



        [Key]
     
    public int Id{get;set;}
    
      public string   GameName{get;set;}
       public string Status{get;set;}

        public int ScoreToWin{get;set;}

        public int MaxPlayers{get;set;}

        public int QuestionIndex{get;set;}

       

    
    }
}