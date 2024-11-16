using OpenCvSharp;
using OpenCvSharp.Extensions;

namespace AutoPalyApp.Helper
{
    public sealed class MyOpenCvHelper
    {
        public static System.Drawing.Point? GetPointByImagePath(string originImgPath, string targetImgPath, bool isShowMat = false)
        {
            //识别目标图片在原图片中的位置
            Mat source = new Mat(originImgPath, ImreadModes.AnyColor);
            Mat target = new Mat(targetImgPath, ImreadModes.AnyColor);
            //Cv2.Resize(target, target, new Size(55, 45));//分辨率不一样时，一定要转换到一样的比例在来比较，不然很难匹配到，图片大小比例影响很大

            Mat result = new Mat();
            Cv2.MatchTemplate(source, target, result, TemplateMatchModes.CCoeffNormed);
            OpenCvSharp.Point minLoc, maxLoc;
            double minValue, maxValue;
            Cv2.MinMaxLoc(result, out minValue, out maxValue, out minLoc, out maxLoc);//68*215  231*267

            if (isShowMat)
            {
                Mat mask = source.Clone();
                //画框显示
                Cv2.Rectangle(mask, maxLoc, new OpenCvSharp.Point(maxLoc.X + target.Cols, maxLoc.Y + target.Rows), Scalar.Green, 2);
                Cv2.ImShow("mask", mask);
                Cv2.WaitKey(0);
                Cv2.DestroyAllWindows();
            }

            if (maxValue > 0.9)//匹配精确的至少要7以上
            {
                return new System.Drawing.Point(maxLoc.X, maxLoc.Y);
            }
            return null;
        }

        public static System.Drawing.Point? GetPointByImageBase64(string originImgPath, string targetImgBase64, bool isShowMat = false)
        {
            //识别目标图片在原图片中的位置
            Mat source = new Mat(originImgPath, ImreadModes.AnyColor);

            var index = targetImgBase64.IndexOf(',');
            targetImgBase64 = targetImgBase64.Substring(index + 1);
            byte[] arr = Convert.FromBase64String(targetImgBase64);
            Bitmap bitmap = new Bitmap(new MemoryStream(arr));
            Mat target = bitmap.ToMat();
            //Cv2.Resize(target, target, new Size(55, 45));//分辨率不一样时，一定要转换到一样的比例在来比较，不然很难匹配到，图片大小比例影响很大

            Mat result = new Mat();
            Cv2.MatchTemplate(source, target, result, TemplateMatchModes.CCoeffNormed);
            OpenCvSharp.Point minLoc, maxLoc;
            double minValue, maxValue;
            Cv2.MinMaxLoc(result, out minValue, out maxValue, out minLoc, out maxLoc);//68*215  231*267

            if (isShowMat)
            {
                Mat mask = source.Clone();
                //画框显示
                Cv2.Rectangle(mask, maxLoc, new OpenCvSharp.Point(maxLoc.X + target.Cols, maxLoc.Y + target.Rows), Scalar.Green, 2);
                Cv2.ImShow("mask", mask);
                Cv2.WaitKey(0);
                Cv2.DestroyAllWindows();
            }

            if (maxValue > 0.9)//匹配精确的至少要7以上
            {
                return new System.Drawing.Point(maxLoc.X, maxLoc.Y);
            }
            return null;
        }
    }
}
