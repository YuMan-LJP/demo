//div支持伸缩
//指定元素时尽量按以下结构，指定的div里面已有一层div，如果指定div里面的子元素第一个不是div则会给当前div嵌套一层div来实现这种结构
//<div id="...">
//   <div>
//   </div>
//</div>
function divCollapsible(id, text) {
    var $div = $(id);
    if ($div.length == 0) {
        console.log("指定id没有找到对应元素");
        return;
    }

    var addHtml = '<i class="fa fa-angle-up icon fa-scaling btnScaling btn" id="fa-angle-up-icon" style="width:auto;position: absolute; right: 13px; top: 17px; z-index: 2;padding:0; -webkit-transition: all 0.5s;-moz-transition: all 0.5s;;-o-transition: all 0.5s; transition: all 0.5s"></i><div class="btnScaling btn" id="btnScalingBox" style="height: 40px; line-height: 40px; margin-top: 0; width: 100%; z-index: 1; text-align:left; display: none; padding: 0"><div class="form-group" style="width: 100%; background-color: #F0F0F0; margin: 0px !important; padding-left: 10px "><span title="' + text + '">' + text + '</span></div></div>';

    //如果子元素第一个就是div，给子元素增加样式，然后当前$div元素添加伸缩箭头按钮
    //如果子元素第一个不是div，则给嵌套一层div，给当前$div元素增加样式，然后给嵌套div添加伸缩箭头按钮
    var childrens = $div.children();
    if (childrens.length > 0 && $div.children().eq(0).is("div")) {
        $div.css("overflow", "hidden");
        $div.children().eq(0).css("overflow", "hidden")
        $div.children().eq(0).css("z-index", "0")
        $div.children().eq(0).addClass("scalingBoxHidden");
        $div.prepend(addHtml);

        //背景色和圆角相关样式尽量符合原来的div
        $('#btnScalingBox').css("background-color", $('.scalingBoxHidden').css("background-color"))
        $('#btnScalingBox').css("border-radius", $('.scalingBoxHidden').css("border-radius"))
        $('#btnScalingBox .form-group').css("background-color", $('.scalingBoxHidden').css("background-color"))
        $('#btnScalingBox .form-group').css("border-radius", $('.scalingBoxHidden').css("border-radius"))
    }
    else {
        $div.wrap('<div class="divwrapper"></div>');
        $('.divwrapper').css("overflow", "hidden");
        $div.css("overflow", "hidden")
        $div.css("z-index", "0")
        $div.addClass("scalingBoxHidden");
        $('.divwrapper').prepend(addHtml);
    }

    var hiddenLabel = $(".scalingBoxHidden");
    var maxHeight = hiddenLabel.height();
    var originalDisplay = hiddenLabel.css("display");
    if (!originalDisplay) {
        originalDisplay = "block";
    }
    var scalingBox = $("#btnScalingBox");
    var minHeight = scalingBox.height();
    var scalingBoxIsShow = false;
    $(".btnScaling.btn").click(function () {
        if (scalingBoxIsShow) {
            scalingBox.css("display", "none");
            hiddenLabel.css('display', originalDisplay);

            hiddenLabel.css('height', "auto");
            maxHeight = hiddenLabel.height();//获取height:auto时的高度作为伸展的最大高度
            hiddenLabel.css('height', "0");

            $(".fa-scaling.fa.fa-angle-up.icon").css("-webkit-transform", "rotate(0)");/* Saf3.1+, Chrome 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-moz-transform", "rotate(0)");/* FF3.5+ 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-ms-transform", "rotate(0)");/* IE9 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-o-transform", "rotate(0)");/* Opera 10.5+ 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("transform", "rotate(0)");
            setHeightBlock(minHeight);
            scalingBoxIsShow = false;
        }
        else {
            $(".fa-scaling.fa.fa-angle-up.icon").css("-webkit-transform", "rotate(-180deg)");/* Saf3.1+, Chrome 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-moz-transform", "rotate(-180deg)");/* FF3.5+ 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-ms-transform", "rotate(-180deg)");/* IE9 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("-o-transform", "rotate(-180deg)");/* Opera 10.5+ 浏览器*/
            $(".fa-scaling.fa.fa-angle-up.icon").css("transform", "rotate(-180deg)");
            setHeightHidden(hiddenLabel.height());
            scalingBoxIsShow = true;
        }

        function setHeightBlock(i) {
            i = i + 10
            hiddenLabel.css('height', i);
            if (i < maxHeight) {
                setTimeout(function () {
                    setHeightBlock(i);
                }, 0);
            } else {
                hiddenLabel.css('height', "auto");
            }
        }//伸展

        function setHeightHidden(i) {
            i = i - 10
            $(hiddenLabel).css('height', i);
            if (i > minHeight) {
                setTimeout(function () {
                    setHeightHidden(i);
                }, 0);
            }
            else {
                scalingBox.css("display", "block");
                $(hiddenLabel).css('display', 'none');
            }
        }//收缩
    })
}