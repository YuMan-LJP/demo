namespace AutoPalyApp.Core.Dto
{
    public class SelectDto
    {
        public SelectDto(string id, string text)
        {
            Id = id;
            Text = text;
        }

        public string Id { get; set; }

        public string Text { get; set; }
    }
}
