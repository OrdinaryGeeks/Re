using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class PlayerIncorrect : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2c843533-cab7-4e14-b806-856d11261bf3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dfb2b546-463f-4fd8-8b04-67ed6fb72a69");

            migrationBuilder.AddColumn<bool>(
                name: "Incorrect",
                table: "Players",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5340bc12-2edf-4da1-b8a3-58d1153715f7", null, "Member", "MEMBER" },
                    { "8f475d68-8813-4ca3-bc13-273d704b3423", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5340bc12-2edf-4da1-b8a3-58d1153715f7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8f475d68-8813-4ca3-bc13-273d704b3423");

            migrationBuilder.DropColumn(
                name: "Incorrect",
                table: "Players");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2c843533-cab7-4e14-b806-856d11261bf3", null, "Admin", "ADMIN" },
                    { "dfb2b546-463f-4fd8-8b04-67ed6fb72a69", null, "Member", "MEMBER" }
                });
        }
    }
}
