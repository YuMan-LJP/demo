using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Xml.Serialization;
using System.Xml;

namespace WbpTest
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            DataTable newTable = new DataTable("ds");
            newTable.Columns.Add("底图名称");
            newTable.Columns.Add("工单号");
            newTable.Columns.Add("参考数");
            newTable.Columns.Add("USA");
            newTable.Columns.Add("EU");
            newTable.Columns.Add("UK");
            newTable.Columns.Add("型体号");
            newTable.Columns.Add("颜色");
            newTable.Columns.Add("BARCODE");
            newTable.Columns.Add("楦型");
            newTable.Columns.Add("StyleName");
            newTable.Columns.Add("段别");
            newTable.Columns.Add("Feature1");
            newTable.Columns.Add("Feature2");
            newTable.Columns.Add("Feature3");
            newTable.Columns.Add("Feature4");
            newTable.Columns.Add("Feature5");
            newTable.Columns.Add("Feature6");
            newTable.Columns.Add("Feature7");
            newTable.Columns.Add("品牌");
            newTable.Columns.Add("客户名称");
            newTable.Columns.Add("季度");
            DataRow row = newTable.NewRow();
            row["底图名称"] = "SO180531001790005-7.5";
            row["工单号"] = "SO180531001790005";
            row["参考数"] = "1";
            row["USA"] = "8";
            row["EU"] = "40.5";
            row["UK"] = "7.0";
            row["型体号"] = "1029713D";
            row["颜色"] = "BLACK/BLACK";
            row["BARCODE"] = "195208544217";
            row["楦型"] = "D";
            row["StyleName"] = "KENTON MID PTC SOFT TOE";
            row["段别"] = "MEN’S";
            row["Feature1"] = "OIL-AND SLIP-RESISTANT";
            row["Feature2"] = "NON-MUTILATING UPPER";
            row["Feature3"] = "KEEN.WET TRAX";
            row["Feature4"] = "KEEN.REGEN";
            row["Feature5"] = "HEAT RESISTANT OUTSOLE";
            row["Feature6"] = "";
            row["Feature7"] = "";
            row["品牌"] = "KEEN";
            row["客户名称"] = "R.G FOOTWEAR（柬埔寨瑞晶）";
            row["季度"] = "F24";
            newTable.Rows.Add(row);
            string data = GetDataStringFromTable(newTable);
            Console.WriteLine(data);
            //PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTE2Ij8+PERhdGFUYWJsZT48eHM6c2NoZW1hIGlkPSJOZXdEYXRhU2V0IiB4bWxucz0iIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOm1zZGF0YT0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtbXNkYXRhIj48eHM6ZWxlbWVudCBuYW1lPSJOZXdEYXRhU2V0IiBtc2RhdGE6SXNEYXRhU2V0PSJ0cnVlIiBtc2RhdGE6TWFpbkRhdGFUYWJsZT0iZHMiIG1zZGF0YTpVc2VDdXJyZW50TG9jYWxlPSJ0cnVlIj48eHM6Y29tcGxleFR5cGU+PHhzOmNob2ljZSBtaW5PY2N1cnM9IjAiIG1heE9jY3Vycz0idW5ib3VuZGVkIj48eHM6ZWxlbWVudCBuYW1lPSJkcyI+PHhzOmNvbXBsZXhUeXBlPjx4czpzZXF1ZW5jZT48eHM6ZWxlbWVudCBuYW1lPSLlupXlm77lkI3np7AiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuW3peWNleWPtyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Y+C6ICD5pWwIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVU0EiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkVVIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVSyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Z6L5L2T5Y+3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLpopzoibIiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkJBUkNPREUiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IualpuWeiyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iU3R5bGVOYW1lIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLmrrXliKsiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmUxIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlMiIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTMiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU0IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlNSIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTYiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLlk4HniYwiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuWuouaIt+WQjeensCIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5a2j5bqmIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48L3hzOnNlcXVlbmNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6Y2hvaWNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6c2NoZW1hPjxkaWZmZ3I6ZGlmZmdyYW0geG1sbnM6bXNkYXRhPSJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOnhtbC1tc2RhdGEiIHhtbG5zOmRpZmZncj0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtZGlmZmdyYW0tdjEiPjxEb2N1bWVudEVsZW1lbnQ+PGRzIGRpZmZncjppZD0iZHMxIiBtc2RhdGE6cm93T3JkZXI9IjAiIGRpZmZncjpoYXNDaGFuZ2VzPSJpbnNlcnRlZCI+POW6leWbvuWQjeensD5TTzE4MDUzMTAwMTc5MDAwNS03LjU8L+W6leWbvuWQjeensD485bel5Y2V5Y+3PlNPMTgwNTMxMDAxNzkwMDA1PC/lt6XljZXlj7c+POWPguiAg+aVsD4xPC/lj4LogIPmlbA+PFVTQT44PC9VU0E+PEVVPjQwLjU8L0VVPjxVSz43LjA8L1VLPjzlnovkvZPlj7c+MTAyOTcxM0Q8L+Wei+S9k+WPtz486aKc6ImyPkJMQUNLL0JMQUNLPC/popzoibI+PEJBUkNPREU+MTk1MjA4NTQ0MjE3PC9CQVJDT0RFPjzmpablnos+RDwv5qWm5Z6LPjxTdHlsZU5hbWU+S0VOVE9OIE1JRCBQVEMgU09GVCBUT0U8L1N0eWxlTmFtZT485q615YirPk1FTuKAmVM8L+auteWIqz48RmVhdHVyZTE+T0lMLUFORCBTTElQLVJFU0lTVEFOVDwvRmVhdHVyZTE+PEZlYXR1cmUyPk5PTi1NVVRJTEFUSU5HIFVQUEVSPC9GZWF0dXJlMj48RmVhdHVyZTM+S0VFTi5XRVQgVFJBWDwvRmVhdHVyZTM+PEZlYXR1cmU0PktFRU4uUkVHRU48L0ZlYXR1cmU0PjxGZWF0dXJlNT5IRUFUIFJFU0lTVEFOVCBPVVRTT0xFPC9GZWF0dXJlNT48RmVhdHVyZTY+PC9GZWF0dXJlNj48RmVhdHVyZTc+PC9GZWF0dXJlNz485ZOB54mMPktFRU48L+WTgeeJjD485a6i5oi35ZCN56ewPlIuRyBGT09UV0VBUu+8iOafrOWflOWvqOeRnuaZtu+8iTwv5a6i5oi35ZCN56ewPjzlraPluqY+RjI0PC/lraPluqY+PC9kcz48L0RvY3VtZW50RWxlbWVudD48L2RpZmZncjpkaWZmZ3JhbT48L0RhdGFUYWJsZT4=
            //PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTE2Ij8+PERhdGFUYWJsZT48eHM6c2NoZW1hIGlkPSJOZXdEYXRhU2V0IiB4bWxucz0iIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOm1zZGF0YT0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtbXNkYXRhIj48eHM6ZWxlbWVudCBuYW1lPSJOZXdEYXRhU2V0IiBtc2RhdGE6SXNEYXRhU2V0PSJ0cnVlIiBtc2RhdGE6TWFpbkRhdGFUYWJsZT0iZHMiIG1zZGF0YTpVc2VDdXJyZW50TG9jYWxlPSJ0cnVlIj48eHM6Y29tcGxleFR5cGU+PHhzOmNob2ljZSBtaW5PY2N1cnM9IjAiIG1heE9jY3Vycz0idW5ib3VuZGVkIj48eHM6ZWxlbWVudCBuYW1lPSJkcyI+PHhzOmNvbXBsZXhUeXBlPjx4czpzZXF1ZW5jZT48eHM6ZWxlbWVudCBuYW1lPSLlupXlm77lkI3np7AiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuW3peWNleWPtyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Y+C6ICD5pWwIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVU0EiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkVVIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVSyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Z6L5L2T5Y+3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLpopzoibIiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkJBUkNPREUiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IualpuWeiyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iU3R5bGVOYW1lIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLmrrXliKsiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmUxIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlMiIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTMiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU0IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlNSIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTYiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLlk4HniYwiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuWuouaIt+WQjeensCIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5a2j5bqmIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48L3hzOnNlcXVlbmNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6Y2hvaWNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6c2NoZW1hPjxkaWZmZ3I6ZGlmZmdyYW0geG1sbnM6bXNkYXRhPSJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOnhtbC1tc2RhdGEiIHhtbG5zOmRpZmZncj0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtZGlmZmdyYW0tdjEiPjxEb2N1bWVudEVsZW1lbnQ+PGRzIGRpZmZncjppZD0iZHMxIiBtc2RhdGE6cm93T3JkZXI9IjAiIGRpZmZncjpoYXNDaGFuZ2VzPSJpbnNlcnRlZCI+POW6leWbvuWQjeensD5TTzE4MDUzMTAwMTc5MDAwNS03LjU8L+W6leWbvuWQjeensD485bel5Y2V5Y+3PlNPMTgwNTMxMDAxNzkwMDA1PC/lt6XljZXlj7c+POWPguiAg+aVsD4xPC/lj4LogIPmlbA+PFVTQT44PC9VU0E+PEVVPjQwLjU8L0VVPjxVSz43LjA8L1VLPjzlnovkvZPlj7c+MTAyOTcxM0Q8L+Wei+S9k+WPtz486aKc6ImyPkJMQUNLL0JMQUNLPC/popzoibI+PEJBUkNPREU+MTk1MjA4NTQ0MjE3PC9CQVJDT0RFPjzmpablnos+RDwv5qWm5Z6LPjxTdHlsZU5hbWU+S0VOVE9OIE1JRCBQVEMgU09GVCBUT0U8L1N0eWxlTmFtZT485q615YirPk1FTuKAmVM8L+auteWIqz48RmVhdHVyZTE+T0lMLUFORCBTTElQLVJFU0lTVEFOVDwvRmVhdHVyZTE+PEZlYXR1cmUyPk5PTi1NVVRJTEFUSU5HIFVQUEVSPC9GZWF0dXJlMj48RmVhdHVyZTM+S0VFTi5XRVQgVFJBWDwvRmVhdHVyZTM+PEZlYXR1cmU0PktFRU4uUkVHRU48L0ZlYXR1cmU0PjxGZWF0dXJlNT5IRUFUIFJFU0lTVEFOVCBPVVRTT0xFPC9GZWF0dXJlNT48RmVhdHVyZTY+PC9GZWF0dXJlNj48RmVhdHVyZTc+PC9GZWF0dXJlNz485ZOB54mMPktFRU48L+WTgeeJjD485a6i5oi35ZCN56ewPlIuRyBGT09UV0VBUu+8iOafrOWflOWvqOeRnuaZtu+8iTwv5a6i5oi35ZCN56ewPjzlraPluqY+RjI0PC/lraPluqY+PC9kcz48L0RvY3VtZW50RWxlbWVudD48L2RpZmZncjpkaWZmZ3JhbT48L0RhdGFUYWJsZT4=

            var subContent = new PreviewDataContent
            {
                Route = "PrintDataService",
                //action = paction,
                dataString = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTE2Ij8+PERhdGFUYWJsZT48eHM6c2NoZW1hIGlkPSJOZXdEYXRhU2V0IiB4bWxucz0iIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOm1zZGF0YT0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtbXNkYXRhIj48eHM6ZWxlbWVudCBuYW1lPSJOZXdEYXRhU2V0IiBtc2RhdGE6SXNEYXRhU2V0PSJ0cnVlIiBtc2RhdGE6TWFpbkRhdGFUYWJsZT0iZHMiIG1zZGF0YTpVc2VDdXJyZW50TG9jYWxlPSJ0cnVlIj48eHM6Y29tcGxleFR5cGU+PHhzOmNob2ljZSBtaW5PY2N1cnM9IjAiIG1heE9jY3Vycz0idW5ib3VuZGVkIj48eHM6ZWxlbWVudCBuYW1lPSJkcyI+PHhzOmNvbXBsZXhUeXBlPjx4czpzZXF1ZW5jZT48eHM6ZWxlbWVudCBuYW1lPSLlupXlm77lkI3np7AiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuW3peWNleWPtyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Y+C6ICD5pWwIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVU0EiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkVVIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJVSyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5Z6L5L2T5Y+3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLpopzoibIiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkJBUkNPREUiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IualpuWeiyIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iU3R5bGVOYW1lIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLmrrXliKsiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmUxIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlMiIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTMiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU0IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSJGZWF0dXJlNSIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0iRmVhdHVyZTYiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IkZlYXR1cmU3IiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48eHM6ZWxlbWVudCBuYW1lPSLlk4HniYwiIHR5cGU9InhzOnN0cmluZyIgbWluT2NjdXJzPSIwIiAvPjx4czplbGVtZW50IG5hbWU9IuWuouaIt+WQjeensCIgdHlwZT0ieHM6c3RyaW5nIiBtaW5PY2N1cnM9IjAiIC8+PHhzOmVsZW1lbnQgbmFtZT0i5a2j5bqmIiB0eXBlPSJ4czpzdHJpbmciIG1pbk9jY3Vycz0iMCIgLz48L3hzOnNlcXVlbmNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6Y2hvaWNlPjwveHM6Y29tcGxleFR5cGU+PC94czplbGVtZW50PjwveHM6c2NoZW1hPjxkaWZmZ3I6ZGlmZmdyYW0geG1sbnM6bXNkYXRhPSJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOnhtbC1tc2RhdGEiIHhtbG5zOmRpZmZncj0idXJuOnNjaGVtYXMtbWljcm9zb2Z0LWNvbTp4bWwtZGlmZmdyYW0tdjEiPjxEb2N1bWVudEVsZW1lbnQ+PGRzIGRpZmZncjppZD0iZHMxIiBtc2RhdGE6cm93T3JkZXI9IjAiIGRpZmZncjpoYXNDaGFuZ2VzPSJpbnNlcnRlZCI+POW6leWbvuWQjeensD5TTzE4MDUzMTAwMTc5MDAwNS03LjU8L+W6leWbvuWQjeensD485bel5Y2V5Y+3PlNPMTgwNTMxMDAxNzkwMDA1PC/lt6XljZXlj7c+POWPguiAg+aVsD4xPC/lj4LogIPmlbA+PFVTQT44PC9VU0E+PEVVPjQwLjU8L0VVPjxVSz43LjA8L1VLPjzlnovkvZPlj7c+MTAyOTcxM0Q8L+Wei+S9k+WPtz486aKc6ImyPkJMQUNLL0JMQUNLPC/popzoibI+PEJBUkNPREU+MTk1MjA4NTQ0MjE3PC9CQVJDT0RFPjzmpablnos+RDwv5qWm5Z6LPjxTdHlsZU5hbWU+S0VOVE9OIE1JRCBQVEMgU09GVCBUT0U8L1N0eWxlTmFtZT485q615YirPk1FTuKAmVM8L+auteWIqz48RmVhdHVyZTE+T0lMLUFORCBTTElQLVJFU0lTVEFOVDwvRmVhdHVyZTE+PEZlYXR1cmUyPk5PTi1NVVRJTEFUSU5HIFVQUEVSPC9GZWF0dXJlMj48RmVhdHVyZTM+S0VFTi5XRVQgVFJBWDwvRmVhdHVyZTM+PEZlYXR1cmU0PktFRU4uUkVHRU48L0ZlYXR1cmU0PjxGZWF0dXJlNT5IRUFUIFJFU0lTVEFOVCBPVVRTT0xFPC9GZWF0dXJlNT48RmVhdHVyZTY+PC9GZWF0dXJlNj48RmVhdHVyZTc+PC9GZWF0dXJlNz485ZOB54mMPktFRU48L+WTgeeJjD485a6i5oi35ZCN56ewPlIuRyBGT09UV0VBUu+8iOafrOWflOWvqOeRnuaZtu+8iTwv5a6i5oi35ZCN56ewPjzlraPluqY+RjI0PC/lraPluqY+PC9kcz48L0RvY3VtZW50RWxlbWVudD48L2RpZmZncjpkaWZmZ3JhbT48L0RhdGFUYWJsZT4=",//data,
                Fid = "3564",
                formatName = "KEEN-PD190300406内盒无ICON",
                jid = "5edecff3-2ac4-4bb4-afda-a585330123e7",
                productId = "PD190300406",
                websocketId = "3a90fbaf-beaa-8122-09fa-472f674d5ca0",
                isTest = "",
                tag = "CreateJpgArtwork",
            };
            subContent.productId = "PD190300406";

            subContent.sign = DoSignWbp(subContent);
            Console.WriteLine(subContent.sign);
        }

        public class PreviewDataContent
        {
            public string Action { set; get; } = "PrintDataService";
            public string Route { set; get; }

            public string isTest { set; get; }
            public string Fid { set; get; }
            public string productId { set; get; }
            public string formatName { set; get; }
            public string jid { set; get; }
            public string dataString { set; get; }
            public string websocketId { set; get; }
            public int gapLeftRight { get; set; } = 1;   //
            /// <summary>
            /// 上下间距
            /// </summary>
            public int gapUpDown { get; set; } = 1; //
            /// <summary>
            /// 纸张高度
            /// </summary>
            public int docHeight { get; set; } = 1; //
            /// <summary>
            /// 纸张宽度
            /// </summary>
            public int docWidth { get; set; } = 1;  //
            /// <summary>
            /// 表示来源来自哪里处理的业务类型
            /// </summary>
            public string tag { set; get; }

            private string _resultUrl;

            private string getUrl()
            {
                if (string.IsNullOrEmpty(_resultUrl))
                {
                    return "https://osp.gzbsn.com";
                }
                return _resultUrl;
            }
            public string returnUrl { set { _resultUrl = value; } get { return getUrl(); } }

            /// <summary>
            /// 开始打印位置 [A4]
            /// </summary>
            public int startPosition { get; set; } = 1; //
            /// <summary>
            /// 是否空位 [A4]
            /// </summary>
            public bool isSizeBlank { get; set; } = false;  //

            public string sign { set; get; }

        }

        protected static string GetDataStringFromTable(DataTable table)
        {
            StringBuilder xml = new StringBuilder();
            using (XmlWriter writer = XmlWriter.Create(xml))
            {
                XmlSerializer serializer = new XmlSerializer(typeof(DataTable));
                serializer.Serialize(writer, table);
                writer.Close();
            }
            string setXml = xml.ToString();

            byte[] b = System.Text.Encoding.Default.GetBytes(setXml);
            //转成 Base64 形式的 System.String  
            string abc = Convert.ToBase64String(b);
            return abc;
        }

        public static string DoSignWbp(object obj)
        {
            string serect = "1234324";
            string modelJson = Newtonsoft.Json.JsonConvert.SerializeObject(obj);
            List<string> igKeys = new List<string>();//忽略不验签的keys
            igKeys.Add("datastring");
            igKeys.Add("sign");
            return DoSign(modelJson, igKeys, serect);
        }

        public static string DoSign(string modelJson, List<string> igKey, string serect)
        {
            /**针对接口必要参数进行加密，
                必要要参数比如：
                    打印机回调：fid,printerinfo
                    打印状态回调通知:fid,wbpid
                    将加密结果写入 sign 参数
                补充参数不加密
             */

            Dictionary<string, string> dicAll = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(modelJson);
            ///key全部转小写
            //Dictionary<string, string> dicAll = new Dictionary<string, string>();

            //dicAll.Add("wbpid", "4324dsfsdf"); //wbpid ，其他
            //dicAll.Add("printerInfo", "4324dsfsdf"); //printerInfo ，其他
            //dicAll.Add("fid", "123"); //fid ，其他
            //dicAll.Add("osp", ""); //osp ，其他的自带参数不加密
            //// dicAll.Add("clientid", "sfdf"); //clientid属于自带参数

            //查找出所有的不为空的值
            Dictionary<string, string> signPara = new Dictionary<string, string>();
            foreach (var item in dicAll)
            {
                string keyValue = item.Value;
                if (!string.IsNullOrEmpty(keyValue) && !igKey.Contains(item.Key.ToLower()))
                {
                    signPara.Add(item.Key.ToLower(), keyValue.ToLower());
                }
            }

            //加密密钥
            string[] keys = signPara.Keys.ToArray();
            Array.Sort(keys, string.CompareOrdinal); //将key重新排序

            //拼接加密参数， keyvalue + keyvalue ,中间没有额外的符号，首尾端加上密钥然后md5
            StringBuilder strValues = new StringBuilder();
            strValues.Append(serect);
            foreach (string key in keys)
            {
                string pkey = key;
                string pvalue = signPara[pkey];
                strValues.Append(pkey + pvalue);
            }
            strValues.Append(serect);
            string value = strValues.ToString();

            //ASCII码 MD5加密
            string sign = MD5Encrypt(value).ToLower();
            //Console.WriteLine("签名前:" + value + "|" + "签名后:" + sign);
            return sign;
        }

        /// <summary>
        /// 进行MD5加密
        /// </summary>
        /// <param name="inputString">需要加密的字符串</param>
        /// <returns>加密后的字符串</returns>
        public static string MD5Encrypt(string inputString)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            byte[] encryptedBytes = md5.ComputeHash(Encoding.ASCII.GetBytes(inputString));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < encryptedBytes.Length; i++)
            {
                sb.AppendFormat("{0:x2}", encryptedBytes[i]);
            }
            return sb.ToString();
        }
    }
}
