interface CartItem extends RegisterItem{
    id:string;
}
interface RegisterItem{
    name:string;
    price:number;
    count:number;
}
const itemList:CartItem[] = [];
const addButton = document.querySelector("#add-button") as HTMLInputElement;
const inputName = document.querySelector("#item-name") as HTMLInputElement;
const inputPrice = document.querySelector("#item-price") as HTMLInputElement;
const inputCount = document.querySelector("#item-count") as HTMLInputElement;
const cartBody = document.querySelector("#cart-items") as HTMLTableSectionElement;
const totalCount = document.querySelector("#total-count") as HTMLSpanElement;
const totalPrice = document.querySelector("#total-price") as HTMLSpanElement;
function formValidate(inputName:HTMLInputElement, inputPrice:HTMLInputElement, inputCount:HTMLInputElement):boolean{
    if(inputName.value.trim() === ""){
        console.log("空文字");
        return false;
    }
    if(inputPrice.value === "" || inputCount.value === ""){
        console.log("不適切な文字が含まれています");
        return false;
    }
    return true;
}
function generateRegisteredItem(itemName:string, itemPrice:number, itemList:CartItem[]):number{
    return itemList.findIndex(listItem => listItem.name === itemName && listItem.price === itemPrice);
}
function registerItem(item:RegisterItem, itemList:CartItem[]):void{
    const registeredItemIdx = generateRegisteredItem(item.name, item.price, itemList);
    if(registeredItemIdx === -1){
        const uniqueId = crypto.randomUUID();
        const newItem:CartItem = {id:uniqueId, name:item.name, price:item.price, count:item.count};
        itemList.push(newItem);
        console.log(`新しく${item.name}がリストに追加されました`);
        return;
    }
    console.log(`${item.name}は登録済みです`);
    const registeredItem = itemList[registeredItemIdx];
    if(registeredItem === undefined){
        throw new Error("何かしらのエラーが起きました");
    }
    itemList[registeredItemIdx] = {...registeredItem, count:registeredItem.count + item.count};
}
function renderTable(cartBody:HTMLTableSectionElement,itemList:CartItem[]):void{
    cartBody.innerHTML = "";
    itemList.forEach(item =>{
        const tr:HTMLTableRowElement = document.createElement("tr");
        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        const tdPrice = document.createElement("td");
        tdPrice.textContent = String(item.price) + " 円";
        const tdCount = document.createElement("td");
        tdCount.textContent = String(item.count) + " 個";
        const tdSubTotal = document.createElement("td");
        tdSubTotal.textContent = String(item.price * item.count) + " 円";
        tr.appendChild(tdName);
        tr.appendChild(tdPrice);
        tr.appendChild(tdCount);
        tr.appendChild(tdSubTotal);
        cartBody.appendChild(tr);
    });
}
function renderStatistics(totalCount:HTMLSpanElement, totalPrice:HTMLSpanElement, itemList:CartItem[]):void{
    totalCount.textContent = String(itemList.reduce((sum, item)=>sum + item.count, 0));
    totalPrice.textContent = String(itemList.reduce((sum, item)=> sum + item.price*item.count, 0));
}


addButton.addEventListener("click", ()=>{
    console.log("クリックされました")
    if(!formValidate(inputName, inputPrice, inputCount)){
        console.log("不適切な形式です")
        return;
    }
    const itemName = inputName.value;
    const itemPrice = Number(inputPrice.value);
    const itemCount = Number(inputCount.value);
    const item:RegisterItem = {name:itemName, price:itemPrice, count:itemCount};
    inputName.value = "";
    inputPrice.value = "1";
    inputCount.value = "1";
    console.log(`商品名: ${itemName}`);
    console.log(`単価: ${itemPrice}`);
    console.log(`数量: ${itemCount}`);
    registerItem(item, itemList);
    for(const item of itemList){
        console.log(`${item.id}-${item.name}-${item.price}-合計${item.count}個`);
    }
    renderTable(cartBody, itemList);
    renderStatistics(totalCount, totalPrice, itemList);
});