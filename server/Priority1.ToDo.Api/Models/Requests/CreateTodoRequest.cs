using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoRequest
{
    [Required]
    public string Title { get; set; }

    public bool IsComplete { get; set; }

    [Required]
    [Range(typeof(DateTime), TodoValidationConstants.MinDate, TodoValidationConstants.MaxDate, ErrorMessage = TodoValidationConstants.ValidationMessage)]
    public DateTime DueDate { get; set; }

    public Todo ToModel()
    {
        return new Todo
        {
            Title = Title,
            IsComplete = IsComplete,
            DueDate = DueDate,
        };
    }
}
