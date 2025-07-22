const COLNUM = 4;

function formatFixedWidth(str, width, padChar = ' ') {
    if (str.length > width) {
        return str.substring(0, width); // Truncate if too long
    } else {
        return str.padEnd(width, padChar); // Pad if too short
    }
}

function addRow(){
    const tbody = document.querySelector("#inputTable tbody");
    const newRow = document.createElement("tr");

    for(let i = 0; i < COLNUM; i++){
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.style.width = "96.5%";
        td.appendChild(input);
        newRow.appendChild(td);
    }
    tbody.appendChild(newRow);
}

function addTenRow(){
    for(let i = 0; i < 10; i++){
        addRow();
    }
}

function submitTable(){
    const inputs = document.querySelectorAll("#inputTable tbody input");
    const data = [];
    inputs.forEach(input => {
        data.push(input.value);
    });

    //output data
    let output = "表格內資料：\n   類別       日期        金額       摘要\n";
    for(let i = 0; i < data.length; i += COLNUM){
        for(let j = 0; j < COLNUM; j++){
            output += formatFixedWidth(data[i+j], 10, "_") + " ";
        }
        output += "\n";
    }
    console.log(output);

    //清空並重置表格
    const tbody = document.querySelector("#inputTable tbody");
    tbody.innerHTML = "";
    addTenRow();
}

window.onload = function(){
    addTenRow();
}