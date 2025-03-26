var logourl = ""; //记录上传图片的地址
var isok = false; //默认图片验证不通过
//初始化
$(function () {
  initialization();
});
//初始化方法
function initialization() {
  if ($(window).width() >= 850) {
    $("#content").focus();
  }
  $("#qrcode").html(
    '<img src="class/qr.php?content=http://www.keweikeji.com/qrcode/&logo=../images/ico/qr.png" style="width:100%;height:100%;object-fit:cover;" />'
  );
}
//生成二维码方法
function qr() {
  var content = document
    .getElementById("content")
    .value.replace(/(^\s*)|(\s*$)/g, "");
  if (content == "") {
    prompt("请输入您的内容", "alert-warning");
    initialization();
    $("#content").val("");
    $("#content").focus();
    return false;
  }
  content = encodeURIComponent(content);
  var logo = "";
  if (logourl != "") {
    logo = ".." + logourl.substr(7, 30);
  }
  $("#qrcode").html(
    '<img src="class/qr.php?content=' +
      content +
      "&logo=" +
      logo +
      '" style="width:100%;height:100%;object-fit:cover;" />'
  );
  $("#qrcode_m").html(
    '<img src="class/qr.php?content=' +
      content +
      "&logo=" +
      logo +
      '" style="width:100%;height:100%;object-fit:cover;" />'
  );
  if ($(window).width() < 850) {
    $("#Modal").modal({ backdrop: "show" });
  } else {
    $("#content").focus();
  }
}
//文本框输入事件
$("#content").on("input propertychange", function () {
  if ($("#content").val().replace(/\s/g, "") == "") {
    initialization();
  }
});
//点击生成二维码按钮
$("#btn_submit").on("click", function () {
  qr();
});
//点击上传logo的div
$("#logo").on("click", function () {
  $("#file").trigger("click"); //响应上传文件按钮
});
//上传图片方法
function upload_logo() {
  var formData = new FormData();
  formData.append("file", $("#file")[0].files[0]);
  if ($("#file")[0].files[0] == undefined) {
    //用户点了取消
    logourl = "";
    $("#logo").html('<p id="lg_ts">点击上传</p>');
    $("#lg_ts").html("点击上传");
    return false;
  }
  //验证图片大小
  var size = $("#file")[0].files[0].size;
  if (size > 1024 * 1024) {
    prompt("请上传小于1M的图片！", "alert-warning", 3000);
    return false;
  }
  //验证图片尺寸
  var MyTest = $("#file")[0].files[0];
  var reader = new FileReader();
  reader.readAsDataURL(MyTest);
  reader.onload = function (theFile) {
    var image = new Image();
    image.src = theFile.target.result;
    image.onload = function () {
      if (this.width == this.height) {
        isok = true;
      } else {
        isok = false;
      }
    };
  };
  setTimeout(function () {
    if (!isok) {
      prompt("请上传尺寸为1:1的图片！", "alert-warning", 3000);
      return false;
    }
    $("#lg_ts").html('<i class="fa fa-spinner fa-pulse fa-fw"></i>');
    $.ajax({
      url: "class/upload_img.php",
      data: formData,
      type: "POST",
      async: "true",
      cache: false, //上传文件无需缓存
      processData: false, //用于对data参数进行序列化处理 这里必须false
      contentType: false,
      success: function (data) {
        if (data != "false") {
          $("#logo").html(
            '<img src="' +
              data +
              '" style="width:100%;height:100%;object-fit:cover;" />'
          );
          logourl = data; //记录上传图片的地址
        } else {
          prompt("上传失败", "alert-danger", 3000);
          $("#logo").html('<p id="lg_ts">点击上传</p>');
          $("#lg_ts").html("点击上传");
        }
      },
      error: function () {
        prompt("服务器连接失败", "alert-danger", 3000);
        $("#logo").html('<p id="lg_ts">点击上传</p>');
        $("#lg_ts").html("点击上传");
      },
    });
  }, 100);
}
//弹出式消息
var prompt = function (message, style, time) {
  style = style === undefined ? "alert-success" : style;
  time = time === undefined ? 1200 : time;
  $("<div>")
    .appendTo("body")
    .addClass("alert " + style)
    .html(message)
    .show()
    .delay(time)
    .fadeOut();
};

const yearDom = document.getElementById("year");
yearDom.innerText = new Date().getFullYear();
