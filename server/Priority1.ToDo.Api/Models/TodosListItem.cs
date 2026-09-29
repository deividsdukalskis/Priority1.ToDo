using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodosListItem
{
	public int Id { get; set; }
	public string Title { get; set; }
	public DateTime CreateDate { get; set; }
	public DateTime UpdateDate { get; set; }
	public List<TodoItem> Todos { get; set; }

	public static TodosListItem From(TodosList list)
	{
		return new TodosListItem
		{
			Id = list.Id,
			Title = list.Title,
			CreateDate = list.CreateDate,
			Todos = list.Todos.Select(TodoItem.From).ToList(),
			UpdateDate = list.UpdateDate,
		};
	}

	public TodosList ToModel()
	{
		return new TodosList
		{
			Id = Id,
			Title = Title,
			CreateDate = CreateDate,
			Todos = Todos.Select(x => x.ToModel()).ToList(),
			UpdateDate = UpdateDate,
		};
	}
}
