using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Priority1.ToDo.Core.Domain;

public class Todo : EntityBase
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public bool IsComplete { get; set; } = false;

    [Required]
    public DateTime DueDate { get; set; }

    [Required]
    public int TodosListId { get; set; }

    [ForeignKey(nameof(TodosListId))]
    public TodosList TodosList { get; set; } = new();
}
