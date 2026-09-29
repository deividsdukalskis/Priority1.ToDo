using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodosListRequest
{
	[Required]
	[MaxLength(200)]
	public string Title { get; set; }

	public TodosList ToModel()
	{
		return new TodosList
		{
			Title = Title,
		};
	}
}
