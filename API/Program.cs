using API.Data;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);


// Add services to the container.
builder.Services.AddDbContext<QuizBowlContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("OGQuizBowl")));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(option =>
{

    var jwtSecurityScheme = new OpenApiSecurityScheme{

     BearerFormat = "JWT",
     Name= "Authorization",
     In = ParameterLocation.Header,
     Type = SecuritySchemeType.ApiKey,
     Scheme= JwtBearerDefaults.AuthenticationScheme,
     Description = "Put Bearer + your token in the box below",
     Reference = new OpenApiReference{
        Id = JwtBearerDefaults.AuthenticationScheme,
        Type = ReferenceType.SecurityScheme
     }   
    };

    option.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    option.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            jwtSecurityScheme, Array.Empty<string>()
        }
    });
});
builder.Services.AddCors();
builder.Services.AddSignalR();
builder.Services.AddIdentityCore<User>(
    option => {option.User.RequireUniqueEmail = true;
    
    }
    
)
    

.AddRoles<IdentityRole>().AddEntityFrameworkStores<QuizBowlContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(option => {
    option.TokenValidationParameters = new TokenValidationParameters{
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime=true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey=  new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
    };
});
builder.Services.AddAuthorization();

builder.Services.AddScoped<TokenService>();



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(option =>
    {
        option.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    });

}  
app.UseDefaultFiles();
app.UseStaticFiles();


  app.UseCors(options => options.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000").AllowCredentials());

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

app.MapHub<API.Hubs.QuizHub>("/hub");


var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<QuizBowlContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try{

    await context.Database.MigrateAsync();
    await DbInitializer.Initialize(context, userManager);
}
catch(Exception ex)
{

logger.LogError(ex, "A problem occurred during migration");

    throw;
}


app.Run();
