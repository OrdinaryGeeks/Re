using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Models
{
    public class PlayerDTO
    {
  public string UserName{get;set;}
  public int Score {get;set;}

  public string Email{get;set;}

  public int GameStateID{get;set;}
}

    }
