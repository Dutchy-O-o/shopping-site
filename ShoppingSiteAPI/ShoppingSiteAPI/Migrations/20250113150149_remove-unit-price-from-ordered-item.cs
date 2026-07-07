using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingSiteAPI.Migrations
{
    /// <inheritdoc />
    public partial class removeunitpricefromordereditem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "OrderedItems");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "OrdersJoinOrderedItemsJoinProductsDtos",
                newName: "Price");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "OrdersJoinOrderedItemsJoinProductsDtos",
                newName: "UnitPrice");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "OrderedItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
