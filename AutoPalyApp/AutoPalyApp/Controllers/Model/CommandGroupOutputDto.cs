using AutoPalyApp.Core.Dto;

namespace AutoPalyApp.Controllers.Model
{
    public class CommandGroupOutputDto
    {
        public string Id { get; set; } = "";

        public string Name { get; set; } = "";

        public string AppName { get; set; } = "";

        public string Remark { get; set; } = "";

        public List<CommandOutputDto> Commands { get; set; } = new List<CommandOutputDto>();
    }

    public class CommandOutputDto : Command
    {
        public string ImageBase64String { get; set; } = "";
    }
}
