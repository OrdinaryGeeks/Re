using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class DropMessageindexGameState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "07465430-cece-4a58-8bca-d6957ba4a003");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "10bcf57d-9db8-4633-bee5-20a800f6914d");

            migrationBuilder.DropColumn(
                name: "MessageIndex",
                table: "GameStates");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "85682b75-8f2c-47c6-a4d9-3e0fb0f886bd", null, "Member", "MEMBER" },
                    { "acd2bc56-7593-46e7-9b94-238f42bff202", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "85682b75-8f2c-47c6-a4d9-3e0fb0f886bd");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "acd2bc56-7593-46e7-9b94-238f42bff202");

            migrationBuilder.AddColumn<int>(
                name: "MessageIndex",
                table: "GameStates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "07465430-cece-4a58-8bca-d6957ba4a003", null, "Member", "MEMBER" },
                    { "10bcf57d-9db8-4633-bee5-20a800f6914d", null, "Admin", "ADMIN" }
                });
        }
    }
}
