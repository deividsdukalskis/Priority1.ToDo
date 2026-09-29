using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Priority1.ToDo.Core.Migrations
{
    /// <inheritdoc />
    public partial class TodosListsCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TodosListId",
                table: "Todos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TodosLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodosLists", x => x.Id);
                });

            // Give existing todos a valid parent before requiring the foreign key.
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT 1 FROM [Todos] WHERE [TodosListId] IS NULL)
                BEGIN
                    INSERT INTO [TodosLists] ([Title], [CreateDate], [UpdateDate])
                    VALUES (N'Default', SYSUTCDATETIME(), SYSUTCDATETIME());

                    DECLARE @defaultListId int = CAST(SCOPE_IDENTITY() AS int);
                    UPDATE [Todos] SET [TodosListId] = @defaultListId
                    WHERE [TodosListId] IS NULL;
                END");

            migrationBuilder.AlterColumn<int>(
                name: "TodosListId",
                table: "Todos",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TodosListId",
                table: "Todos",
                column: "TodosListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_TodosLists_TodosListId",
                table: "Todos",
                column: "TodosListId",
                principalTable: "TodosLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_TodosLists_TodosListId",
                table: "Todos");

            migrationBuilder.DropTable(
                name: "TodosLists");

            migrationBuilder.DropIndex(
                name: "IX_Todos_TodosListId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "TodosListId",
                table: "Todos");
        }
    }
}
