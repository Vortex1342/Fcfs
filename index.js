document.getElementById("tableData").style.display = "none";
document.getElementById("instruction").style.display = "none";
document.getElementById("hideInstruction").style.display = "none";

let processes = [];
let ganttIndex = -1;
let totalTime = 0;

class Processes {
    constructor(name, arrivalTime, burstTime, priority = 0 ) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.priority = priority;
    }
}

function createProcesses() {
    let noOfProcess = 0;
    noOfProcess = parseInt(document.getElementById("noOfProcess").value);
    processes = [];

    for (let index = 0; index < noOfProcess; index++) {
        let pName = "p" + index;
        let arrivalTime = Math.floor(Math.random() * 10) + 1;
        let burstTime = Math.floor(Math.random() * 10) + 1;

        let process = new Processes(pName, arrivalTime, burstTime);
        processes.push(process);
    }

    generateTable();
}

function addProcess() {
    let pName = document.getElementById("processName").value;
    let arrivalTime = document.getElementById("arrivalTime").value;
    let burstTime = document.getElementById("burstTime").value;

    let process = new Processes(pName, arrivalTime, burstTime);
    processes.push(process);

    generateTable();
}

function generateTable() {
    let tableContent = "";
    processes.forEach(process => {
        let row = process.name;
        tableContent += "<tr id="+row+">";
        tableContent += "<td>" + process.name + "</td>";
        tableContent += "<td>" + process.arrivalTime + "</td>";
        tableContent += "<td>" + process.burstTime + "</td>";
        tableContent += "</tr>";
    });
    document.getElementById("tableData").style.display = "";
    document.getElementById("tableContent").innerHTML = tableContent;
}

function openInstruction() {
    document.getElementById("instruction").style.display = "";
    document.getElementById("hideInstruction").style.display = "";
    document.getElementById("showInstruction").style.display = "none";
}

function closeInstruction() {
    document.getElementById("instruction").style.display = "none";
    document.getElementById("hideInstruction").style.display = "none";
    document.getElementById("showInstruction").style.display = "";
}

function updateProcess() {
    let pName = document.getElementById("uProcessName").value;
    let arrivalTime = document.getElementById("uArrivalTime").value;
    let burstTime = document.getElementById("uBurstTime").value;

    for (let index = 0; index < processes.length; index++) {
        let process = processes[index];
        if(process.name === pName){
            process.arrivalTime = arrivalTime;
            process.burstTime = burstTime;
            break;
        }
    }

    generateTable();
}

// function createGanttChart(){
//     totalTime = 0;
//     let tableContent = "<div class=\"col-1 \">" + "<span class=\"text-end\">"+totalTime+"</span> </div>";
//     document.getElementById("ganttChart").innerHTML = tableContent;
//     fcfsCompare();
//     addGanttChart(tableContent);
// }

function addGanttChart(){
    fcfsCompare();
    if(ganttIndex < processes.length-1)
        ganttIndex ++;
    else
        return;
    totalTime = totalTime + processes[ganttIndex].burstTime;
    let content = "<div class=\"col border-end\"> "+ processes[ganttIndex].name + "<span class=\"text-end\">" + totalTime + "</span> </div>";
    let tableContent = document.getElementById("ganttChart").innerHTML;
    tableContent +=  content;
    document.getElementById("ganttChart").innerHTML = tableContent;
    
}

function fcfsCompare(){
    processes.sort(fcfs);
    for (let index = 0; index < processes.length; index++) {
        let process = processes[index];
        process.priority = index;
    }
}

function fcfs(x, y){
    if(x.arrivalTime < y.arrivalTime)
        return -1;

    if(x.arrivalTime > y.arrivalTime)
        return 1;
    
    return 0;
}

function reset(){
    document.getElementById("ganttChart").innerHTML = "";
    document.getElementById("tableData").innerHTML = "";
}