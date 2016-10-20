/* **************************************************

Name: hd_network.js

Description: Country/Region menu on header

Create: 2014.05.30
Update: 2015.01.06

Copyright 2014 Hitachi, Ltd.

***************************************************** */



var _CRText = '<div id="CountryRegionArea" lang="en">';
_CRText += '<div id="CountryRegionSet">';
_CRText += '<div class="Inner">';
_CRText += '<h2><a href="http://www.hitachi.com/global/index.html">Hitachi Group Global Network</a></h2>';
_CRText += '<ul class="Global">';
_CRText += '<li class="FirstItem"><span>Global (<a href="http://www.hitachi.com/">English</a>)</span></li>';
_CRText += '</ul>';

_CRText += '<h3 class="Americas Current"><a href="javascript:void(0);">Americas</a></h3>';
_CRText += '<div class="Americas Current">';
_CRText += '<div class="ColumnSet">';
_CRText += '<div class="Column1 FirstItem"><ul>';
_CRText += '<li><span>Brazil (<a href="http://www.hitachi.com.br/" lang="pt">Português</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Canada (<a href="http://www.hitachi.ca/">English</a> / <a href="http://www.hitachi.ca/fre/" lang="fr">Français</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>South America (<a href="http://www.hitachi.com.ar/" lang="es">Español</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>U.S.A. (<a href="http://www.hitachi.us/index.html">English</a>)</span></li>';
_CRText += '</ul></div></div></div>'

_CRText += '<h3 class="Asia"><a href="javascript:void(0);">Asia</a></h3>';
_CRText += '<div class="Asia">';
_CRText += '<div class="ColumnSet">';
_CRText += '<div class="Column1 FirstItem"><ul>';
_CRText += '<li><span>China (<a href="http://www.hitachi.com.cn/" lang="zh">简体中文</a>)</span></li>';
_CRText += '<li><span>Hong Kong (<a href="http://www.hitachi.com.hk/" lang="zh-TW">繁體中文</a> / <a href="http://www.hitachi.com.hk/eng/">English</a>)</span></li>';
_CRText += '<li><span>India (<a href="http://www.hitachi.co.in/">English</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Indonesia (<a href="http://www.hitachi.co.id/" lang="id">Bahasa Indonesia</a> / <a href="http://www.hitachi.co.id/eng/">English</a>)</span></li>';
_CRText += '<li><span>Japan (<a href="http://www.hitachi.co.jp/" lang="ja">日本語</a>)</span></li>';
_CRText += '<li><span>Korea (<a href="http://www.hitachi.co.kr/" lang="ko">한국어</a> / <a href="http://www.hitachi.co.kr/jpn/" lang="ja">日本語</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Malaysia (<a href="http://www.hitachi.com.my/">English</a>)</span></li>';
_CRText += '<li><span>Philippines (<a href="http://www.hitachi.com.ph/">English</a>)</span></li>';
_CRText += '<li><span>Singapore (<a href="http://www.hitachi.com.sg/">English</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Taiwan (<a href="http://www.hitachi.com.tw/" lang="zh-TW">繁體中文</a> / <a href="http://www.hitachi.com.tw/eng/">English</a>)</span></li>';
_CRText += '<li><span>Thailand (<a href="http://www.hitachi.co.th/" lang="th">ไทย</a> / <a href="http://www.hitachi.co.th/eng/">English</a>)</span></li>';
_CRText += '<li><span>Vietnam (<a href="http://www.hitachi.com.vn/" lang="vi">Tiếng Việt</a> / <a href="http://www.hitachi.com.vn/eng/">English</a>)</span></li>';
_CRText += '</ul></div></div></div>'

_CRText += '<h3 class="Europe"><a href="javascript:void(0);">Europe</a></h3>';
_CRText += '<div class="Europe">';
_CRText += '<div class="ColumnSet">';
_CRText += '<div class="Column1 FirstItem"><ul>';
_CRText += '<li><span>Europe Gateway (<a href="http://www.hitachi.eu/">English</a>)</span></li>';
_CRText += '<li><span>Austria (<a href="http://www.hitachi.at/" lang="de">Deutsch</a>)</span></li>';
_CRText += '<li><span>Belgium (<a href="http://www.hitachi.be/fre/" lang="fr">Français</a> / <a href="http://www.hitachi.be/dut/" lang="nl">Nederlands</a>)</span></li>';
_CRText += '<li><span>Cyprus (<a href="http://www.hitachi.com.cy/cyp/" lang="el">Ελληνικά</a> / <a href="http://www.hitachi.com.cy/tur/" lang="tr">Türkçe</a>)</span></li>';
_CRText += '<li><span>Czech (<a href="http://www.hitachi.cz/" lang="cs">Čeština</a>)</span></li>';
_CRText += '<li><span>Denmark (<a href="http://www.hitachi.dk/" lang="da">Dansk</a>)</span></li>';
_CRText += '<li><span>Finland (<a href="http://www.hitachi.fi/" lang="fi">Suomi</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>France (<a href="http://www.hitachi.fr/" lang="fr">Français</a>)</span></li>';
_CRText += '<li><span>Germany (<a href="http://www.hitachi.de/" lang="de">Deutsch</a>)</span></li>';
_CRText += '<li><span>Greece (<a href="http://www.hitachi.gr/" lang="el">Ελληνικά</a>)</span></li>';
_CRText += '<li><span>Ireland (<a href="http://www.hitachi.ie/">English</a>)</span></li>';
_CRText += '<li><span>Italy (<a href="http://www.hitachi.it/" lang="it">Italiano</a>)</span></li>';
_CRText += '<li><span>Latvia (<a href="http://www.hitachi.lv/" lang="lv">Latviešu valoda</a>)</span></li>';
_CRText += '<li><span>Lithuania (<a href="http://www.hitachi.lt/" lang="lt">Lietuvių</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Netherlands (<a href="http://www.hitachi.nl/" lang="nl">Nederlands</a>)</span></li>';
_CRText += '<li><span>Norway (<a href="http://www.hitachi.no/" lang="no">Norsk</a>)</span></li>';
_CRText += '<li><span>Poland (<a href="http://www.hitachi.pl/" lang="pl">Język Polski</a>)</span></li>';
_CRText += '<li><span>Portugal (<a href="http://www.hitachi.pt/" lang="pt">Português</a>)</span></li>';
_CRText += '<li><span>Romania (<a href="http://www.hitachi.ro/" lang="ro">Română</a>)</span></li>';
_CRText += '<li><span>Russia (<a href="http://www.hitachi.ru/" lang="ru">Русский язык</a>)</span></li>';
_CRText += '<li><span>Slovakia (<a href="http://www.hitachi.eu/sk/" lang="sk">Slovenský</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Spain (<a href="http://www.hitachi.es/" lang="es">Español</a>)</span></li>';
_CRText += '<li><span>Sweden (<a href="http://www.hitachi.se/" lang="sv">Svenska</a>)</span></li>';
_CRText += '<li><span>Switzerland (<a href="http://www.hitachi.ch/ita/" lang="it">Italiano</a> / <a href="http://www.hitachi.ch/deu/" lang="de">Deutsch</a> / <a href="http://www.hitachi.ch/fre/" lang="fr">Français</a>)</span></li>';
_CRText += '<li><span>Turkey (<a href="http://www.hitachi.com.tr/" lang="tr">Türkçe</a>)</span></li>';
_CRText += '<li><span>United Kingdom (<a href="http://www.hitachi.co.uk/">English</a>)</span></li>';
_CRText += '</ul></div></div></div>'

_CRText += '<h3 class="MENA"><a href="javascript:void(0);">Middle East and Africa</a></h3>';
_CRText += '<div class="MENA">';
_CRText += '<div class="ColumnSet">';
_CRText += '<div class="Column1 FirstItem"><ul>';
_CRText += '<li><span>Middle East and North Africa <br />(<a href="http://www.hitachi.ae/" lang="ar">اللغة العربية</a> / <a href="http://www.hitachi.ae/eng/">English</a>)</span></li>';
_CRText += '</ul></div>'
_CRText += '<div class="Column1"><ul>';
_CRText += '<li><span>Sub-Saharan Africa (<a href="http://www.hitachi.co.za/">English</a>)</span></li>';
_CRText += '</ul></div></div></div>'

_CRText += '<h3 class="Oceania"><a href="javascript:void(0);">Oceania</a></h3>';
_CRText += '<div class="Oceania">';
_CRText += '<div class="ColumnSet">';
_CRText += '<div class="Column1 FirstItem"><ul>';
_CRText += '<li><span>Oceania (<a href="http://www.hitachi.com.au/">English</a>)</span></li>';
_CRText += '</ul></div></div></div>'

_CRText += '<p class="BtnClose"><a href="javascript:void(0);">Close</a></p>';
_CRText += '</div>';
_CRText += '</div>';
_CRText += '</div>';