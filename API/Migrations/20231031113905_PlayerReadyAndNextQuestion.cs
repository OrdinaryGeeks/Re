using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class PlayerReadyAndNextQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "25859d7c-7adb-488f-9111-0af3bb2b2759");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "80836862-5d4a-4398-8cec-976e2739c399");

            migrationBuilder.AddColumn<bool>(
                name: "NextQuestion",
                table: "Players",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Ready",
                table: "Players",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "41371e43-04ec-4d26-8bd0-4a8253cbbea6", null, "Admin", "ADMIN" },
                    { "e1217750-51f3-4113-8135-ac546f5d7e88", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "41371e43-04ec-4d26-8bd0-4a8253cbbea6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "e1217750-51f3-4113-8135-ac546f5d7e88");

            migrationBuilder.DropColumn(
                name: "NextQuestion",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "Ready",
                table: "Players");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "25859d7c-7adb-488f-9111-0af3bb2b2759", null, "Admin", "ADMIN" },
                    { "80836862-5d4a-4398-8cec-976e2739c399", null, "Member", "MEMBER" }
                });
        }
    }
}
