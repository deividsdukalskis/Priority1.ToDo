using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Core.Services.Interfaces;

public interface ITodosListService
{
	Task<TodosList> CreateAsync(TodosList itemToCreate, CancellationToken ct = default);

	Task<bool> DeleteAsync(int id, CancellationToken ct = default);

	Task<List<TodosList>> GetAllAsync(CancellationToken ct = default);

	Task<TodosList?> GetByIdAsync(int id, CancellationToken ct = default);

	Task<TodosList?> UpdateAsync(TodosList itemToUpdate, CancellationToken ct = default);
}