using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UniqueBuzzedInPlayerToGame : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "49b88b17-0bec-4a51-b80b-e4e41eef6615");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c4d4c56b-ee45-4b20-b720-4a5080a48179");

            migrationBuilder.AddColumn<int>(
                name: "BuzzedInPlayerId",
                table: "GameStates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "1c484f97-196e-41fd-a8f3-f9629d354a89", null, "Admin", "ADMIN" },
                    { "762f010a-4eef-4900-a660-2c4e4b70df4c", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "1c484f97-196e-41fd-a8f3-f9629d354a89");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "762f010a-4eef-4900-a660-2c4e4b70df4c");

            migrationBuilder.DropColumn(
                name: "BuzzedInPlayerId",
                table: "GameStates");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "49b88b17-0bec-4a51-b80b-e4e41eef6615", null, "Member", "MEMBER" },
                    { "c4d4c56b-ee45-4b20-b720-4a5080a48179", null, "Admin", "ADMIN" }
                });
        }
    }
}
