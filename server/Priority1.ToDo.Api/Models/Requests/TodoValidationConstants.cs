namespace Priority1.ToDo.Api.Models.Requests;

using System.Globalization;

public static class TodoValidationConstants
{
	public const string MinDate = "0001-01-02";
	public const string MaxDate = "9999-12-31";
	public const string ValidationMessage = "Please select a valid due date.";
}
