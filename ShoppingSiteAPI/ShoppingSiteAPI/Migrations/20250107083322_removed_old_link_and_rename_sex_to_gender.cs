using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShoppingSiteAPI.Migrations
{
    /// <inheritdoc />
    public partial class removed_old_link_and_rename_sex_to_gender : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductDtos_OLMAZSA_SIL");

            migrationBuilder.DropColumn(
                name: "ImageURL",
                table: "ProductDtos");

            migrationBuilder.RenameColumn(
                name: "Sex",
                table: "Products",
                newName: "Gender");

            migrationBuilder.RenameColumn(
                name: "Sex",
                table: "ProductDtos",
                newName: "Gender");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "Products",
                newName: "Sex");

            migrationBuilder.RenameColumn(
                name: "Gender",
                table: "ProductDtos",
                newName: "Sex");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageURL",
                table: "ProductDtos",
                type: "bytea",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductDtos_OLMAZSA_SIL",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    ProductName = table.Column<string>(type: "text", nullable: false),
                    Sex = table.Column<string>(type: "text", nullable: false),
                    StockQuantity = table.Column<int>(type: "integer", nullable: true),
                    alt_url = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                });
        }
    }
}
