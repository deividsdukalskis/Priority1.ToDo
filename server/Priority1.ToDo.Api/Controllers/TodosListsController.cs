using Microsoft.AspNetCore.Mvc;
using Priority1.ToDo.Api.Models;
using Priority1.ToDo.Api.Models.Requests;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Api.Controllers;

[ApiController]
[Route("todos-lists")]
public class TodosListsController : ControllerBase
{
	private readonly ITodosListService _todosListService;

	public TodosListsController(ITodosListService todosListService)
	{
		_todosListService = todosListService;
	}

	[HttpGet]
	public async Task<ActionResult<List<TodosListItem>>> GetAll(CancellationToken ct)
	{
		var todosLists = await _todosListService.GetAllAsync(ct);
		return Ok(todosLists.Select(TodosListItem.From));
	}

	[HttpGet("{id:int}")]
	public async Task<ActionResult<TodosListItem>> GetById(int id, CancellationToken ct)
	{
		var todosList = await _todosListService.GetByIdAsync(id, ct);
		return todosList is null ? NotFound() : Ok(TodosListItem.From(todosList));
	}

	[HttpPost]
	public async Task<ActionResult<TodosListItem>> Create([FromBody] CreateTodosListRequest request, CancellationToken ct)
	{
		var created = await _todosListService.CreateAsync(request.ToModel(), ct);
		return CreatedAtAction(nameof(GetById), new { id = created.Id }, TodosListItem.From(created));
	}

	[HttpPut("{id:int}")]
	public async Task<ActionResult<TodosListItem>> Update(int id, [FromBody] UpdateTodosListRequest request, CancellationToken ct)
	{
		var updated = await _todosListService.UpdateAsync(request.ToModel(id), ct);
		return updated is null ? NotFound() : Ok(TodosListItem.From(updated));
	}

	[HttpDelete("{id:int}")]
	public async Task<IActionResult> Delete(int id, CancellationToken ct)
	{
		var deleted = await _todosListService.DeleteAsync(id, ct);
		return deleted ? NoContent() : NotFound();
	}
}
