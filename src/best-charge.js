function bestCharge(selectedItems) {
  const allItems =  loadAllItems();
  const promotions =  loadPromotions();
  
  var selectedItemsObj = [];
  for(var index in selectedItems){
    let arr = selectedItems[index].split("x");
    let count = parseInt(arr[1].trim());
    allItems.forEach(item=>{
      if(arr[0].trim()==item.id){
        let obj = {id:item.id,name:item.name,price:item.price,num:count};
        selectedItemsObj.push(obj);
      }
    })
  }

  console.log(selectedItemsObj);

  
  let total1 = 0;
  let total2 = 0;
  let type1 = false;
  let type2 = false;
  let type = '';
  let promotionItems = [];
  promotions.forEach(promotion=>{
    if(promotion.type == "满30减6元"){
      selectedItemsObj.forEach(item=>{
        total1 += item.price*item.num;
        if(total1>=30){
          total1 -= 6;
          type1 = true;
        }
      });
    }
    if(promotion.type == "指定菜品半价"){
      total2 = selectedItemsObj.reduce((sum,obj)=>{
        if(promotion.items.includes(obj.id)){
          promotion.items.forEach(item=>{
            if(obj.id==item){
              sum += (obj.price*obj.num)/2;
              type2 = true;
              promotionItems.push(obj.name);
            }
          });
        }else{
          sum +=(obj.price*obj.num);
        }
        return sum;
      },0);
    }
  })

  let total = selectedItemsObj.reduce((sum, obj)=>{
    return sum + obj.price*obj.num;
  },0);

  if(total1 < total2 && type1 == true){
    minMoney = total1;
    type = '满30减6元';
  }else if(total1 > total2 && type2 == true){
    minMoney = total2;
    type = '指定菜品半价';
  }else{
    type = 'none';
    minMoney = total;
  }
  
  let receipt = `============= 订餐明细 =============\n`;
  selectedItemsObj.forEach(item=>{
    receipt += `${item.name} x ${item.num} = ${item.num*item.price}元\n`;
  });
  if(type != 'none'){
    receipt += `-----------------------------------\n`;
    receipt += `使用优惠:\n`;
    if( type == '指定菜品半价'){
      receipt += `指定菜品半价(${promotionItems.join("，")})`
    }else if(type == '满30减6元'){
      receipt += `满30减6元`
    }
    receipt += `，省${total-minMoney}元\n`;
  }
  receipt += `-----------------------------------\n`;
  receipt += `总计：${minMoney}元\n`
  receipt += `===================================\n`;
  
  console.log(receipt);
  return receipt;
}

module.export={bestCharge};