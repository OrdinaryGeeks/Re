using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class UniqueOnGameName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4a3a43eb-3cb5-4553-90f2-022ffc52314a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "daa72272-26d6-44de-b946-b31f4af68978");

            migrationBuilder.AlterColumn<string>(
                name: "GameName",
                table: "GameStates",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "49b88b17-0bec-4a51-b80b-e4e41eef6615", null, "Member", "MEMBER" },
                    { "c4d4c56b-ee45-4b20-b720-4a5080a48179", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GameStates_GameName",
                table: "GameStates",
                column: "GameName",
                unique: true,
                filter: "[GameName] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GameStates_GameName",
                table: "GameStates");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "49b88b17-0bec-4a51-b80b-e4e41eef6615");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c4d4c56b-ee45-4b20-b720-4a5080a48179");

            migrationBuilder.AlterColumn<string>(
                name: "GameName",
                table: "GameStates",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "4a3a43eb-3cb5-4553-90f2-022ffc52314a", null, "Admin", "ADMIN" },
                    { "daa72272-26d6-44de-b946-b31f4af68978", null, "Member", "MEMBER" }
                });
        }
    }
}
