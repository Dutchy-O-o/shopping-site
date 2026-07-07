using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingSiteAPI.Migrations
{
    /// <inheritdoc />
    public partial class Kupa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_OrderedItems_OrderItemId",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_OrderItemId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "OrderItemId",
                table: "Products",
                newName: "StockQuantity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StockQuantity",
                table: "Products",
                newName: "OrderItemId");

            migrationBuilder.AddColumn<int>(
                name: "TotalAmount",
                table: "Orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Products_OrderItemId",
                table: "Products",
                column: "OrderItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_OrderedItems_OrderItemId",
                table: "Products",
                column: "OrderItemId",
                principalTable: "OrderedItems",
                principalColumn: "OrderedItemId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
