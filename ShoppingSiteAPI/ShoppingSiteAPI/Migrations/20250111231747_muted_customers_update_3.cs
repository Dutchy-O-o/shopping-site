using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingSiteAPI.Migrations
{
    /// <inheritdoc />
    public partial class muted_customers_update_3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MutedCustomers_Reviews_ReviewId",
                table: "MutedCustomers");

            migrationBuilder.DropTable(
                name: "MutedCustomersJoinCustomersJoinReviewsDtos");

            migrationBuilder.DropIndex(
                name: "IX_MutedCustomers_ReviewId",
                table: "MutedCustomers");

            migrationBuilder.DropColumn(
                name: "ReviewId",
                table: "MutedCustomers");

            migrationBuilder.CreateTable(
                name: "MutedCustomersJoinCustomersDtos",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    CustomerFirstName = table.Column<string>(type: "text", nullable: false),
                    CustomerLastName = table.Column<string>(type: "text", nullable: false),
                    WhyMutedDescription = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MutedCustomersJoinCustomersDtos");

            migrationBuilder.AddColumn<int>(
                name: "ReviewId",
                table: "MutedCustomers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MutedCustomersJoinCustomersJoinReviewsDtos",
                columns: table => new
                {
                    Comment = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    CustomerName = table.Column<string>(type: "text", nullable: false),
                    ReviewId = table.Column<int>(type: "integer", nullable: false),
                    WhyMutedDescription = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateIndex(
                name: "IX_MutedCustomers_ReviewId",
                table: "MutedCustomers",
                column: "ReviewId");

            migrationBuilder.AddForeignKey(
                name: "FK_MutedCustomers_Reviews_ReviewId",
                table: "MutedCustomers",
                column: "ReviewId",
                principalTable: "Reviews",
                principalColumn: "ReviewId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
