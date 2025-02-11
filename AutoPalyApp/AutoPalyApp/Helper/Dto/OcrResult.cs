﻿using Newtonsoft.Json;

namespace AutoPalyApp.Helper.Dto
{
    public class OcrResult
    {
        public int Code { get; set; }
        public object? Data { get; set; }

        [JsonIgnore]
        public bool Succeed => Code == 100;

        [JsonIgnore]
        public OcrData[]? OcrData => Succeed ? JsonConvert.DeserializeObject<OcrData[]>((Data + "").ToString()) : null;
    }
}
