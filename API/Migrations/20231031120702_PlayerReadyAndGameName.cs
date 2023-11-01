using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class PlayerReadyAndGameName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "41371e43-04ec-4d26-8bd0-4a8253cbbea6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e1217750-51f3-4113-8135-ac546f5d7e88");

            migrationBuilder.AddColumn<string>(
                name: "GameName",
                table: "Players",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2c843533-cab7-4e14-b806-856d11261bf3", null, "Admin", "ADMIN" },
                    { "dfb2b546-463f-4fd8-8b04-67ed6fb72a69", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2c843533-cab7-4e14-b806-856d11261bf3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dfb2b546-463f-4fd8-8b04-67ed6fb72a69");

            migrationBuilder.DropColumn(
                name: "GameName",
                table: "Players");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "41371e43-04ec-4d26-8bd0-4a8253cbbea6", null, "Admin", "ADMIN" },
                    { "e1217750-51f3-4113-8135-ac546f5d7e88", null, "Member", "MEMBER" }
                });
        }
    }
}
