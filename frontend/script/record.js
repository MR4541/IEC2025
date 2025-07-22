const COLNUM = [0, 6, 6, 5];
const NUM_FUNC = 3; 
const BACKGROUND_COLOR = ["#ffffff", "#f1fff0", "#fff0f0", "#f0f0ff"]
const BACKGROUND_INPUT_COLOR = ["#ffffff", "#f8fff8", "#fff8f8", "#f8f8ff"]
const BACKGROUND_BUTTON_COLOR = ["#fcfcfc", "#b2c2b3", "#c2b2b2", "#b2b3c2"]

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
        const input = document.createElement("input");
        input.type = "text";
        input.style.width = "94%";
        td.appendChild(input);
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
}

function addTenRow(funcIndex=1){
    for(let i = 0; i < 10; i++){
        addRow(funcIndex);
    }
}

function deleteRow(button){
    const delRow = button.closest("tr"); //find the closest element have "tr"
    delRow.remove();
}

function clearAllRow(funcIndex=1){
    const tbody = document.querySelector(`#inputTable${funcIndex} tbody`);
    tbody.innerHTML = "";
    addTenRow(funcIndex);
}

function submitTable(funcIndex=1){
    const inputs = document.querySelectorAll(`#inputTable${funcIndex} tbody input`);
    const data = [];
    inputs.forEach(input => {
        data.push(input.value);
    });

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
}

window.onload = function(){
    changeToFunc(1);
}