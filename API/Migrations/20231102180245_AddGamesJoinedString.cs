using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddGamesJoinedString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06b1af0e-03aa-4610-9f22-f8634497e9f2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a72c5454-b94a-4b74-a9f1-447732bf7a48");

            migrationBuilder.AddColumn<string>(
                name: "GamesJoined",
                table: "Players",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4a3a43eb-3cb5-4553-90f2-022ffc52314a", null, "Admin", "ADMIN" },
                    { "daa72272-26d6-44de-b946-b31f4af68978", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4a3a43eb-3cb5-4553-90f2-022ffc52314a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "daa72272-26d6-44de-b946-b31f4af68978");

            migrationBuilder.DropColumn(
                name: "GamesJoined",
                table: "Players");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06b1af0e-03aa-4610-9f22-f8634497e9f2", null, "Member", "MEMBER" },
                    { "a72c5454-b94a-4b74-a9f1-447732bf7a48", null, "Admin", "ADMIN" }
                });
        }
    }
}
