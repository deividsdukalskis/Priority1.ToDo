using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class UpdateTodoRequest
{
    
    [Required]
    public string Title { get; set; }

    public bool IsComplete { get; set; }

	[Required]
	[Range(typeof(DateTime), TodoValidationConstants.MinDate, TodoValidationConstants.MaxDate, ErrorMessage = TodoValidationConstants.ValidationMessage)]
	public DateTime DueDate { get; set; }

    public Todo ToModel(int id)
    {
        return new Todo
        {
            Id = id,
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate,
        };
    }
}
