using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAnnotation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5340bc12-2edf-4da1-b8a3-58d1153715f7");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8f475d68-8813-4ca3-bc13-273d704b3423");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "06b1af0e-03aa-4610-9f22-f8634497e9f2", null, "Member", "MEMBER" },
                    { "a72c5454-b94a-4b74-a9f1-447732bf7a48", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "06b1af0e-03aa-4610-9f22-f8634497e9f2");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a72c5454-b94a-4b74-a9f1-447732bf7a48");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5340bc12-2edf-4da1-b8a3-58d1153715f7", null, "Member", "MEMBER" },
                    { "8f475d68-8813-4ca3-bc13-273d704b3423", null, "Admin", "ADMIN" }
                });
        }
    }
}
