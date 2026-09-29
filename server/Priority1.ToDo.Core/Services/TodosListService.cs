using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Core.Services;

public class TodosListService : ITodosListService
{
	private readonly AppDbContext _context;

	public TodosListService(AppDbContext context)
	{
		_context = context;
	}

	public async Task<List<TodosList>> GetAllAsync(CancellationToken ct = default)
	{
		return await _context.TodosLists.ToListAsync(ct);
	}

	public async Task<TodosList?> GetByIdAsync(int id, CancellationToken ct = default)
	{
		return await _context.TodosLists.Include(t => t.Todos).FirstOrDefaultAsync(t => t.Id == id, ct);
	}

	public async Task<TodosList> CreateAsync(TodosList itemToCreate, CancellationToken ct = default)
	{
		_context.TodosLists.Add(itemToCreate);
		await _context.SaveChangesAsync(ct);
		return itemToCreate;
	}

	public async Task<TodosList?> UpdateAsync(TodosList itemToUpdate, CancellationToken ct = default)
	{
		var todosList = await _context.TodosLists.FirstOrDefaultAsync(t => t.Id == itemToUpdate.Id, ct);
		if (todosList is null)
		{
			return null;
		}

		todosList.Title = itemToUpdate.Title;

		await _context.SaveChangesAsync(ct);
		return todosList;
	}

	public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
	{
		var todosList = await _context.TodosLists.FirstOrDefaultAsync(t => t.Id == id, ct);
		if (todosList is null)
		{
			return false;
		}

		_context.TodosLists.Remove(todosList);

		try
		{
			await _context.SaveChangesAsync(ct);
		}
		catch (DbUpdateConcurrencyException)
		{
			return false;
		}

		return true;
	}
}
