"use strict";!function t(e,n,o){function r(a,s){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(i)return i(a,!0);throw new Error("Cannot find module '"+a+"'")}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return r(n?n:t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var i="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(t,e,n){var o;window.addEventListener("storage",function(t){switch(t.key){case"getTab":o||(console.log("getTab event"),localStorage.setItem("tab","I'm the first tab."),localStorage.removeItem("tab"));break;case"tab":console.log("tab event"),o||(o=!0,$("#content").html("<div class='alert'><p>你有其他分頁已經與其他人建立連線，請關閉此分頁。</p></div>")),console.log("This is not the first tab.")}}),e.exports.isMultiTab=function(){return o},e.exports.checkMultiTabs=function(){o||(console.log("Send getTab event."),localStorage.setItem("getTab",Date.now()))}},{}],2:[function(t,e,n){!function(){function e(){$("#content").html('<h1>告訴大家你們這桌在做什麼吧！</h1><form method="post"><div class="cont"><span>主題 </span><input class="form-text" id="subject" type="text" name="subject"></div><input class="btn" id="new" type="submit" value="確認"></form>')}var n=t("./../../libs/tabs");window.onload=function(){n.checkMultiTabs(),setTimeout(function(){null==n.isMultiTab()&&e()},300)}}()},{"./../../libs/tabs":1}]},{},[2]);