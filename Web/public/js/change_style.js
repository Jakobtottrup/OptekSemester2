/**
 * Created by ste on 27-04-2017.
 */

var chosen_style = 1;

function setRoot(aa, bb, cc, dd) {
    var sheet = document.styleSheets[document.styleSheets.length-1];
    sheet.insertRule(":root{--main-:" + aa + ";--menu-:" + bb + ";--info-:" + cc + ";--text-:" + dd + ";}", 1);
}

col_set = [
    {main:"#F98866",menu:"#FF420E",info:"#80BD9E",text:"#89DA59"},//1
    {main:"#04202C",menu:"#304040",info:"#5B7065",text:"#C9D1C8"}
];










chosen_style -= 1;
setRoot(col_set[chosen_style].main, col_set[chosen_style].menu, col_set[chosen_style].info, col_set[chosen_style].text);