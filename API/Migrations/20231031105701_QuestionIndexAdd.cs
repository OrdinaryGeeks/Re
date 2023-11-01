using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class QuestionIndexAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0cb1aac8-fea9-49eb-80bc-a588ecbd6a85");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "488d8c91-b999-46e3-af4a-70123cfba49f");

            migrationBuilder.AddColumn<int>(
                name: "QuestionIndex",
                table: "GameStates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "25859d7c-7adb-488f-9111-0af3bb2b2759", null, "Admin", "ADMIN" },
                    { "80836862-5d4a-4398-8cec-976e2739c399", null, "Member", "MEMBER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "25859d7c-7adb-488f-9111-0af3bb2b2759");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "80836862-5d4a-4398-8cec-976e2739c399");

            migrationBuilder.DropColumn(
                name: "QuestionIndex",
                table: "GameStates");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0cb1aac8-fea9-49eb-80bc-a588ecbd6a85", null, "Admin", "ADMIN" },
                    { "488d8c91-b999-46e3-af4a-70123cfba49f", null, "Member", "MEMBER" }
                });
        }
    }
}
