using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class UpdateTodosListRequest
{
	[Required]
	public string Title { get; set; }

	public TodosList ToModel(int id)
	{
		return new TodosList
		{
			Id = id,
			Title = Title,
		};
	}
}
