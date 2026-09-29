using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Core.Domain;

public class TodosList : EntityBase
{
	[Required]
	[MaxLength(200)]
	public string Title { get; set; } = string.Empty;

	public List<Todo> Todos { get; set; } = new();
}
