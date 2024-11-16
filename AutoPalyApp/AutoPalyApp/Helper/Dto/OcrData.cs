namespace AutoPalyApp.Helper.Dto
{
    public class OcrData
    {
        public int[][]? Box { get; set; }
        public double Score { get; set; }
        public string? Text { get; set; }
    }
}
