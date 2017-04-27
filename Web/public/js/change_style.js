/**
 * Created by ste on 27-04-2017.
 */

function save_local() {
    localStorage.setItem('chosen_styling', JSON.stringify(chosen_style));
}

function load_local() {
    chosen_style = JSON.parse(localStorage.getItem('chosen_styling'));
}

function setRoot(aa, bb, cc, dd, order) {
    var ul_col = [aa, bb, cc, dd];
    var col_ord = [ul_col[order.charAt(0)-1], ul_col[order.charAt(1)-1], ul_col[order.charAt(2)-1], ul_col[order.charAt(3)-1]];

    var sheet = document.styleSheets[document.styleSheets.length-1];
    sheet.insertRule(":root{--main-:" + col_ord[0] + ";--menu-:" + col_ord[1] + ";--info-:" + col_ord[2] + ";--text-:" + col_ord[3] + ";}", 1);
}

function next_style() {
    chosen_style += 1;
    if (chosen_style > col_set.length) {
        chosen_style = 1;
    }
    update_style();
}

function previous_style() {
    chosen_style -= 1;
    if (chosen_style < 1) {
        chosen_style = col_set.length;
    }
    update_style();
}

function update_style() {
    save_local();
    window.location.reload(false);
}

/*
[] = text on page
 _____________________________
|________text_________________|
|      |                      |
| menu |  ___________         |
|[text]| |           |        |
|______| |  info     |        |
|        |           |        |
| main   | [text]    |   main |
|        |           |        |
|        |           |        |
|        |___________|        |
|_____________________________|
|        menu  [info]         |
|_____________________________|

 */

col_set = [
    {main:"#003B46",menu:"#07575B",info:"#66A5AD",text:"#C4DFE6",order:"1234",name:"Cool Blues"},//1
    {main:"#021C1E",menu:"#004445",info:"#2C7873",text:"#6FB98F",order:"1234",name:"Watery Blue-Greens"},//2
    {main:"#011A27",menu:"#063852",info:"#F0810F",text:"#E6DF44",order:"1234",name:"Day & Night"},//3
    {main:"#1E1F26",menu:"#283655",info:"#4D648D",text:"#D0E1F9",order:"1234",name:"Berry Blues"},//4
    {main:"#F9BA32",menu:"#426E86",info:"#F8F1E5",text:"#2F3131",order:"1234",name:"Modern & Urban"},//5

    {main:"#04202C",menu:"#304040",info:"#5B7065",text:"#C9D1C8",order:"1234",name:"Misty Greens"},//6
    {main:"#217CA3",menu:"#E29930",info:"#32384D",text:"#211D30",order:"1234",name:"Sun & Sky"},//7
    {main:"#004D47",menu:"#128277",info:"#52958B",text:"#B9C4C9",order:"1234",name:"Aqua Blues"},//8
    {main:"#335252",menu:"#D4DDE1",info:"#AA4B41",text:"#2D3033",order:"1234",name:"Understated & Versatile"},//9
    {main:"#2C4A52",menu:"#537072",info:"#8E9B97",text:"#F4EBDB",order:"1234",name:"Hazy Grays"},//10

    {main:"#2F2E33",menu:"#D5D6D2",info:"#FFFFFF",text:"#3A5199",order:"1234",name:"Sleek & Modern"},//11
    {main:"#756867",menu:"#D5D6D2",info:"#353C3F",text:"#FF8D3F",order:"1234",name:"Orange Accent"},//12
    {main:"#962715",menu:"#FFFFFF",info:"#1E1E20",text:"#BBC3C6",order:"1234",name:"Professional & Traditional"},//13
    {main:"#A3A599",menu:"#FBCD4B",info:"#282623",text:"#88A550",order:"1234",name:"Technology Meets Nature"},//14
    {main:"#DDDEDE",menu:"#232122",info:"#A5C05B",text:"#7BA4A8",order:"1234",name:"Urban Living"},//15

    {main:"#2C4A52",menu:"#8E9B97",info:"#537072",text:"#F4EBDB",order:"1234",name:"Gustav test 1"}//16
];

if (localStorage.getItem('chosen_styling')) {
    console.log("Found chosen_style");
    load_local();
} else {
    console.log("Created new chosen_style");
    chosen_style = 1;
    save_local();
}

console.log(JSON.parse(localStorage.getItem('chosen_styling')));

con_chosen = chosen_style - 1;
setRoot(col_set[con_chosen].main, col_set[con_chosen].menu, col_set[con_chosen].info, col_set[con_chosen].text, col_set[con_chosen].order);


$( document ).ready(function() {
    $(".new_style_info").html("" + chosen_style + " / " + col_set.length + ", Name: " + col_set[con_chosen].name);
});
