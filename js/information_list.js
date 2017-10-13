/*
 * @Author: PangLei 
 * @Date: 2017-10-13 11:42:09 
 * @Last Modified by: PangLei
 * @Last Modified time: 2017-10-13 14:17:20
 */

// 临时克隆数据　请删除
for (var a = 0; a < 10; a++) {
  var templi = $(".information-list-items").last().clone();
  $(".information-list").append(templi);
}
