const COLNUM = [0, 6, 6, 5];
const NUM_FUNC = 3; 
const BACKGROUND_COLOR = ["#ffffff", "#f1fff0", "#fff0f0", "#f0f0ff"];
const BACKGROUND_INPUT_COLOR = ["#ffffff", "#f8fff8", "#fff8f8", "#f8f8ff"];
const BACKGROUND_BUTTON_COLOR = ["#fcfcfc", "#b2c2b3", "#c2b2b2", "#b2b3c2"];
const TABLE_INPUT_TYPE = [[],
    ["text", "text", "number", "number", "nil", "text"],
    ["text", "text", "number", "number", "nil", "text"],
    ["text", "text", "text", "number", "text"],
];
const TABLE_SUM_INDEX = [0, 4, 4, 3];
let currentFuncIndex = 1;

function formatFixedWidth(str, width, padChar = ' ') {
    if (str.length > width) {
        return str.substring(0, width); // Truncate if too long
    } else {
        return str.padEnd(width, padChar); // Pad if too short
    }
}

function addRow(funcIndex=1){
    const tbody = document.querySelector(`#inputTable${funcIndex} tbody`);
    const newRow = document.createElement("tr");

    for(let i = 0; i < COLNUM[funcIndex]; i++){
        const td = document.createElement("td");
        if(i != TABLE_SUM_INDEX[funcIndex] || funcIndex == 3){
            const input = document.createElement("input");
            input.type = TABLE_INPUT_TYPE[funcIndex][i];
            input.oninput = ()=>updateSubtotal(input);
            input.style.width = "94%";
            if(i == TABLE_SUM_INDEX[funcIndex] && funcIndex == 3){
                input.classList.add("subtotal");
            }
            td.appendChild(input);
        }else{
            td.innerText = "0";
            td.classList.add("subtotal");
        }
        newRow.appendChild(td);
    }

    //delete button
    const delTd = document.createElement("td");
    const delButton = document.createElement("button");
    delButton.innerText = "刪除";
    delButton.style.width = "100%";
    delButton.style.textAlign = "center";
    delButton.onclick = function(){
        deleteRow(this);
    };
    delTd.appendChild(delButton);
    newRow.append(delTd);
    tbody.appendChild(newRow);
    document.querySelectorAll(`#div-of-func${funcIndex} input`).forEach((item) => {
        item.style.backgroundColor = BACKGROUND_INPUT_COLOR[funcIndex];
    });
}

function addTenRow(funcIndex=1){
    for(let i = 0; i < 10; i++){
        addRow(funcIndex);
    }
}

function deleteRow(button){
    const delRow = button.closest("tr"); //find the closest element have "tr"
    const table = button.closest("table");
    delRow.remove();
    updateTotal(table);
}

function clearAllRow(funcIndex=1){
    const tbody = document.querySelector(`#inputTable${funcIndex} tbody`);
    tbody.innerHTML = "";
    addTenRow(funcIndex);

    const mainInputs = document.querySelectorAll(`#div-of-func${funcIndex} .main-info input`);
    mainInputs.forEach((input)=>{
        input.value = "";
    });
}

function updateSubtotal(inputElement) {
    if(currentFuncIndex == 3){
        updateTotal(inputElement.closest("table"));
        return;
    }
    const row = inputElement.closest("tr");
    const price = parseFloat(row.cells[3].querySelector("input").value) || 0;
    const qty = parseFloat(row.cells[2].querySelector("input").value) || 0;
    const subtotal = price * qty;
  
    row.cells[4].textContent = subtotal.toFixed(0); // 小計欄
    updateTotal(inputElement.closest("table"));
}
  
function updateTotal(table) {
    const subtotals = table.querySelectorAll(".subtotal");
    // console.log(subtotals);  
    let total = 0;
    subtotals.forEach(td => {
      total += parseInt(td.textContent) || parseInt(td.value) || 0;
    });
    document.querySelector(`#totalAmount${currentFuncIndex}`).innerHTML = String(total);
}

function submitTable(funcIndex=1){
    const inputs = document.querySelectorAll(`#inputTable${funcIndex} tbody td`);
    const data = [];
    inputs.forEach(input => {
        if(input.textContent=="刪除")
            return;
        if(input.textContent=="")
            data.push(input.children[0].value);
        else 
            data.push(input.textContent);
    });
    console.log(data);

    //output data
    let output = "表格內資料：\n";
    for(let i = 0; i < data.length; i += COLNUM[funcIndex]){
        for(let j = 0; j < COLNUM[funcIndex]; j++){
            output += formatFixedWidth(data[i+j], 8, "_") + " ";
        }
        output += "\n";
    }
    console.log(output);

    //清空並重置表格
    const tbody = document.querySelector(`#inputTable${funcIndex} tbody`);
    tbody.innerHTML = "";
    addTenRow(funcIndex);

    const mainInputs = document.querySelectorAll(`#div-of-func${funcIndex} .main-info input`);
    mainInputs.forEach((input)=>{
        input.value = "";
    });
}

function changeToFunc(funcIndex=1){
    for(let i = 1; i <= NUM_FUNC; i++){
        if(i != funcIndex){
            document.querySelector(`#div-of-func${i}`).style.display = "none";
            document.querySelector(`#button-func${i}`).style.backgroundColor = BACKGROUND_BUTTON_COLOR[0];
        }else{  
            document.querySelector(`#div-of-func${i}`).style.display = "block";
            document.querySelector(`#button-func${i}`).style.backgroundColor = BACKGROUND_BUTTON_COLOR[funcIndex];
        }
    }
    document.querySelector(`#div-of-func${funcIndex}`).style.backgroundColor = BACKGROUND_COLOR[funcIndex];
    document.body.style.backgroundColor = BACKGROUND_COLOR[funcIndex];
    clearAllRow(funcIndex);
    document.querySelectorAll(`#div-of-func${funcIndex} input`).forEach((item) => {
        item.style.backgroundColor = BACKGROUND_INPUT_COLOR[funcIndex];
    });
    currentFuncIndex = funcIndex;
}

window.onload = function(){
    changeToFunc(1);
}