using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController :ControllerBase
    {

        UserManager<User> _userManager;
        TokenService _tokenService;
        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }
        

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByNameAsync(loginDTO.UserName);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDTO.Password))
            return Unauthorized();

            return new UserDTO{
                Email=user.Email,
                Token = await _tokenService.GenerateToken(user),
                UserName = user.UserName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterDTO>> Register(RegisterDTO registerDTO)
        {


            var user = new User{UserName =registerDTO.UserName, Email=registerDTO.Email};
            var result = await _userManager.CreateAsync(user, registerDTO.Password);

            if(!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {

                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            return new UserDTO
            {
                Email=user.Email,
                Token = await _tokenService.GenerateToken(user)
            };
        }
    }
}