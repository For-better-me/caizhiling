/*
  Copyright 2015 The <Tianjin WenShuai Technology Co., Ltd.> Authors. All rights reserved.
  Use of this source code is governed by a license that can be
  found in the LICENSE file.
  $Id: hirokit.source.js 1 2013-12-04 10:10:22Z Hiroki $
*/
window.plugins = [];
!(function(){
  //使用JavaScript严格模式,避免各种奇怪的bug
  "use strict";
  
  //支持全局功能
  window.using = {}, window.ws = {}, window.ws.pluglist = [];
  
  /**
   * @description 注册命名空间
   * @param {String} fullNS 完整的命名空间字符串,如 qui.dialog
   * @param {Boolean} isIgnorSelf 是否忽略自己, 默认为false, 不忽略
   * @example using.namespace("QingFeed.Text.Bold");
   */
  using["namespace"] = function(fullNS, isIgnorSelf){
      //命名空间合法性校验依据
      var reg = /^[_$a-z]+[_$a-z0-9]*/i;
           
      // 将命名空间切成N部分, 比如baidu.libs.Firefox等
      var nsArray = fullNS.split(".");
      var sEval = "";
      var sNS = "";
      var n = isIgnorSelf ? nsArray.length - 1 : nsArray.length;
      for (var i = 0; i < n; i++){
          //命名空间合法性校验
          if(!reg.test(nsArray[i])) {
              throw new Error("Invalid namespace:" + nsArray[i] + "");
              return ;
          }
          if (i != 0) sNS += ".";
          sNS += nsArray[i];
          // 依次创建构造命名空间对象(假如不存在的话)的语句
          sEval += "if(typeof(" + sNS + ")=='undefined') " + sNS + "=new Object();else " + sNS + ";";
      }
      //生成命名空间
      if (sEval != "") {
          return eval(sEval);
      }
      return {};
  };

  /**
   * @description 格式化数字
   * @param {Number} number 要转换的数字
   * @example ws["parseNumber"]("12345678910")
   * @return 12,345,678,910
   */
   using.namespace("ws.parseNumber");
   ws["parseNumber"] = function(number){
     var strNumber = number + "",
         retNumber = "",
         counter = 0;
     for(var i = strNumber.length - 1; i >= 0; i--){
       retNumber = strNumber.charAt(i) + retNumber;
       counter ++;
       if(counter == 3){
         counter = 0;
         if(i != 0){
           retNumber = "," + retNumber;
         }
       }
     }
     return retNumber;
   }
   
  /**
   * @description 多次绑定onload事件
   * @param {Function} exec onload事件触发后执行的代码段
   * @example ws["onload"](function(){ … });
   */
   using.namespace("ws.onload");
   ws["onload"] = function(exec){
      var evt = window.onload;
      if (typeof window.onload != "function") {
          window.onload = exec;
      } else {
        window.onload = function() {
            evt();
            exec();
        }
      }
   }
   
  /**
   * @description 在某节点后插入元素
   * @param {HTMLElement} newHTMLElement 新元素
   * @param {HTMLElement} targetHTMLElement 目标元素
   * @example ws["insertAfter"]([…, …]);
   */
   using.namespace("ws.insertAfter");
   ws["insertAfter"] = function(newHTMLElement, targetHTMLElement){
      var parentNode = targetHTMLElement.parentNode;
       if(parentNode.lastChild == targetHTMLElement){
         parentNode.appendChild(newHTMLElement);
       } else {
          parentNode.insertBefore(newHTMLElement, targetHTMLElement.nextSibling);
       }
   }
   
  /**
   * @description 截取指定长度的字符串,在其后添加指定字串
   * @param {String} string 需要截取的字符串
   * @param {Number} length 截取长度
   * @example ws["overflowClip"]("Hello", 2, "@");
   * @return "He@"
   */
   using.namespace("ws.overflowClip");
   ws["overflowClip"] = function(string, length, markdown){
     var temp, counts = 0, pattern = /[^\x00-\xff]/, newstrs = "";
     for(var i = 0; i < string.length; i++){
       if(counts < length) {
         temp = string.substr(i, 1);
         if(pattern.exec(temp) == null){
           counts += 1;
         }else{
           counts += 2;
         }
         newstrs += temp;
       } else {
         break;
       }
     }
     return newstrs + (markdown || "…");
   }

  /**
   * @description 字数统计(中文一个字算两个字符,英文一个字母算一个字符,不区分大小写)
   * @param {String} strTemp 需要计算长度的字串
   * @example ws["stringLength"]("Hello,你好!");
   * @return 11
   */
   using.namespace("ws.stringLength");
   ws["stringLength"] = function(strTemp){
     var i, sum = 0;
     for(i in strTemp){
       if(strTemp.charCodeAt(i) >= 0 && strTemp.charCodeAt(i) <= 255){
         sum += 1;
       }else{
         sum += 2;
       }
     }
     return sum;
   }
   
  /**
   * @description 日期格式化 (自触发函数,用于向Date对象装载方法,如果不需要此方法,请将函数自触发时使用的括号"()"去掉)
   * @param {String}  format 日期格式字符串
   * @example new Date().Format("YYYY-MM-DD hh:mm:ss 星期w");
   * @return 2016-02-06 11:33:17 星期六
   */
   using.namespace("ws.dateFormat");
   ws["dateFormat"] = (function(){
    Date.prototype.Format = function(format){
      var initialized = format;
      var Week = ["日", "一", "二", "三", "四", "五", "六"];
      initialized = initialized.replace(/yyyy|YYYY/, this.getFullYear());
      initialized = initialized.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : "0" + (this.getYear() % 100));
      initialized = initialized.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : "0" + (this.getMonth() + 1));
      initialized = initialized.replace(/M/g, (this.getMonth() + 1));
      initialized = initialized.replace(/w|W/g, Week[this.getDay()]);
      initialized = initialized.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : "0" + this.getDate());
      initialized = initialized.replace(/d|D/g, this.getDate());
      initialized = initialized.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : "0" + this.getHours());
      initialized = initialized.replace(/h|H/g, this.getHours());
      initialized = initialized.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : "0" + this.getMinutes());
      initialized = initialized.replace(/m/g, this.getMinutes());
      initialized = initialized.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : "0" + this.getSeconds());
      initialized = initialized.replace(/s|S/g, this.getSeconds());
      return initialized;
     }
   })();
   
  /**
   * @description HTML的转义
   * @param {String} htmlText
   * @example ws["HTML"]["ENCODE"]("<html lang=\"zh-cn\"><\/html>")
   * @return &lt;html lang=&quot;zh-cn&quot;&gt;&lt;/html&gt;
   */
   using.namespace("ws.HTML");
   ws["HTML"]["ENCODE"] = (function(htmlText){
     return htmlText.replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
   });
  /**
   * @description HTML的解码
   * @param {String} htmlText
   * @example ws["HTML"]["DECODE"]("&lt;html lang=&quot;zh-cn&quot;&gt;&lt;/html&gt;")
   * @return <html lang="zh-cn"></html>
   */
   ws["HTML"]["DECODE"] = (function(htmlText){
     return htmlText.replace(/\&amp\;/g, "&").replace(/\&quot\;/g, "\"").replace(/\&lt\;/g, "<").replace(/\&gt\;/g, ">");
   });
   
   /**
   * @description 引入其他插件模块
   * @param {String} module 模块的完整文件名(不包含".js")
   * @param {Function} callback 模块引入后执行的函数
   * @param {String} prefix 模块存在于哪个目录下,默认为 source/lib
   */
   using.namespace("ws.plugins");
   using.namespace("ws.pluglist");
   ws["plugins"] = function(module, callback, prefix){
     if(!new RegExp(module.replace(/[^a-zA-Z]+/ig, ""), "ig").test(window.plugins)){
     //动态创建script元素
     var scriptsNode = document.createElement("script");
         scriptsNode.setAttribute("src", (prefix || "template/openPlatform\/style\/source\/lib\/") + module + ".js?" + DISCUZ["VERHASH"]);
         scriptsNode.setAttribute("type","text\/javascript");
         ws["insertAfter"](scriptsNode, document.getElementsByTagName("script")[document.getElementsByTagName("script").length - 1]);
         if(callback){
           //onreadystate检测js是否加载完成
           if(!/netscape/ig.test(navigator.appName)){
             scriptsNode.onreadystatechange = function(){
               if(scriptsNode.readyState === "complete" || scriptsNode.readyState === "loaded"){
                 try {
                  callback();
                 } catch(e) {
                   return true;
                 }
               }
             }
           } else {
             scriptsNode.onload = function(){
               try {
                 callback();
               } catch(e) {
                 return true;
               }
             }
           }
         }
         window.plugins.push(module.replace(/[^a-zA-Z]+/ig, ""));
         return scriptsNode;
       } else {
         ws["onload"](function(){
           try {
             callback();
           } catch (e) {
             return true;
           }
         });
       }
   }
   /**
   * @description 变更地址栏中的参数
   * @param {String} url 需要变更的地址
   * @param {String} param 需要变更的参数名
   * @param {String} value 需要变更的参数值
   * @param {String} clear 清除掉目标地址的某个参数
   * @example ws["url"]["update"]("http://127.0.0.1/?data-param=1&data-param2=host", "data-param", "owner", "");
   * @return http://127.0.0.1/?data-param=owner&data-param2=host
   */
   using.namespace("ws.url");
   ws["url"]["update"] = function(url, param, value, clear){
    var URL, params, paramsArr, IsExist = false,
    NewURL = url;  //window.location.href
    if (url.indexOf("?") > 0 && url) {
      URL = url.substr(0, url.indexOf("?"));
      params = url.substr(url.indexOf("?") + 1, url.length);
    } else {
      URL = url;
      params = "";
    }
    if (params != "") {
      paramsArr = params.split("&");
      for (var i = 0; i <= paramsArr.length - 1; i++) {
        if (String(param).toUpperCase() == String(paramsArr[i].split("=")[0]).toUpperCase()) {
          paramsArr[i] = param + "=" + value;
          IsExist = true;
          if (String(clear) == "") {
            break;
          }
        } else if ((String(clear) != "") && (String(clear).toUpperCase() == String(paramsArr[i].split("=")[0])).toUpperCase()){
          paramsArr[i] = clear + "=";
        }
      }
      for (var i = 0; i <= paramsArr.length - 1; i++) {
        if (i == 0) {
          params = paramsArr[i];
        } else {
          params = params + "&" + paramsArr[i];
        }
      }
      NewURL = URL + "?" + params;
      if (!IsExist) {
        NewURL = NewURL + "&" + param + "=" + value;
      }
    } else {
      NewURL = URL + "?" + param + "=" + value;
    }
    return NewURL;
   }
   
   /**
   * @description 获取当前页面地址栏中的某个参数
   * @example new ws["url"]["get"]()["data-param-name"]
   * @return "data-param-value" || undefined
   */
   ws["url"]["get"] = function(){
      var name, value, str = location.href, num = str.indexOf("?"), str = str.substr(num + 1), arr = str.split("&");
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          this[name] = value;
        }
      }
    }

   /**
   * @description 检测某一模块是否存在
   * @example ws["module"]("index")
   * @return undefined || {HTMLElement}
   */
   using.namespace("ws.module");
   ws["module"] = function(module){
     return document.getElementById(module.toLowerCase());
   }
   
   /**
   * @description 焦点图设置
   * @example ws["module"]("index")
   * @return undefined || {HTMLElement}
   */
   using.namespace("ws.slide");
   ws["slide"] = function(){
     $("[data-slide]").each(function(){
       $(this).css({
         backgroundImage: "url(" + $(this).attr("data-slide") + ")"
       });
       if($(this).attr("data-link")){
         $(this).on("click", function(){
           location.href = $(this).attr("data-link");
         });
       }
     });
   }
})();