document.getElementById("tableData").style.display = "none";
document.getElementById("instruction").style.display = "none";
document.getElementById("hideInstruction").style.display = "none";

let processes = [];
let ganttIndex = -1;
let totalTime = 0;
let intervalId = null;
let ganttStatus = false;

class Processes {
  constructor(
    name,
    arrivalTime,
    burstTime,
    priority = 0,
    completiontime = -1,
    wt = -1,
    tat = -1
  ) {
    this.name = name;
    this.arrivalTime = arrivalTime;
    this.burstTime = burstTime;
    this.priority = priority;
    this.completiontime = completiontime;
    this.wt = wt;
    this.tat = tat;
  }
}

function createProcesses_main() {
  processes = [];

  // Add 5 processes with specific values
  const processData = [
    { name: "P1", arrivalTime: 2, burstTime: 6 },
    { name: "P2", arrivalTime: 5, burstTime: 2 },
    { name: "P3", arrivalTime: 1, burstTime: 8 },
    { name: "P4", arrivalTime: 0, burstTime: 2 },
    { name: "P5", arrivalTime: 4, burstTime: 4 },
  ];

  for (let index = 0; index < processData.length; index++) {
    const { name, arrivalTime, burstTime } = processData[index];
    let process = new Processes(name, arrivalTime, burstTime);
    processes.push(process);
  }
  resetCompletionTimeColumn();
  document.getElementById("addGanttBtn").disabled = false;
  document.getElementById("ganttChart").innerHTML = "";
  ganttIndex = -1;
  ganttStatus = false;
  generateTable();
}

// function addProcess() {
//   let pName = document.getElementById("processName").value;
//   let arrivalTime = document.getElementById("arrivalTime").value;
//   let burstTime = document.getElementById("burstTime").value;

//   let process = new Processes(pName, arrivalTime, burstTime);
//   processes.push(process);

//   generateTable();
// }

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
    if (process.name === pName) {
      process.arrivalTime = arrivalTime;
      process.burstTime = burstTime;
      break;
    }
  }

  generateTable();
}

function addGanttChart() {
  fcfsCompare();
  if (ganttIndex < processes.length - 1) ganttIndex++;
  else {
    ganttStatus = true;
    showResult();
    return;
  }

  totalTime += processes[ganttIndex].burstTime;
  let content =
    '<div class="col flex border border-r-black"> ' +
    processes[ganttIndex].name +
    '<div class="text-end">' +
    totalTime +
    "</div> </div>";
  let tableContent = document.getElementById("ganttChart").innerHTML;
  tableContent += content;
  document.getElementById("ganttChart").innerHTML = tableContent;

  let rowId = processes[ganttIndex].name;
  let tableRow = document.getElementById(rowId);
  if (tableRow) {
    tableRow.style.opacity = "0.3";
  }
}

function generateTable() {
  let tableContent = "";
  processes.forEach((process, processId) => {
    let row = process.name;
    tableContent += "<tr id=" + row + ">";
    tableContent += "<td>" + process.name + "</td>";
    tableContent += "<td>" + process.arrivalTime + "</td>";
    tableContent += "<td>" + process.burstTime + "</td>";

    (process.completiontime != -1 )
      ? (tableContent += "<td>" + process.completiontime + "</td>")
      : null;

    (process.tat != -1)
      ? (tableContent +=
        "<td>" + (process.tat === 0 ? "0" : process.tat) + "</td>")
      : null;

    (process.wt != -1)
      ? (tableContent +=
        "<td>" +
        (processId === 0 && process.wt === 0 ? "0" : process.wt) +
        "</td>")
      : null;

    tableContent += "</tr>";
  });

  let tableContentElement = document.getElementById("tableContent");
  if (tableContentElement) {
    tableContentElement.innerHTML = tableContent;
  }

  // Display the "tableData" element
  let tableDataElement = document.getElementById("tableData");
  if (tableDataElement) {
    tableDataElement.style.display = "";
  }
}

function showResult() {
  let columns = document.getElementById("tableHeadRow").innerHTML;
  document.getElementById("tableHeadRow").innerHTML = columns;
  document.getElementById("addGanttBtn").disabled = true;

  generateResultData();

  generateTable();

  if (ganttIndex === processes.length - 1) {
    revealCompletionTimeColumn();
  }
}

function revealCompletionTimeColumn() {
  document.getElementById("completionTimeHeader").style.display = "";
  document.getElementById("completionTimeHeader2").style.display = "";
  document.getElementById("completionTimeHeader3").style.display = "";
}

function resetCompletionTimeColumn() {
  document.getElementById("completionTimeHeader").style.display = "none";
  document.getElementById("completionTimeHeader2").style.display = "none";
  document.getElementById("completionTimeHeader3").style.display = "none";
}

function generateResultData() {
  let cTime = 0;
  for (let index = 0; index < processes.length; index++) {
    cTime += processes[index].burstTime;
    processes[index].completiontime = cTime;

    processes[index].tat =
      processes[index].completiontime - processes[index].arrivalTime;

    processes[index].wt = processes[index].tat - processes[index].burstTime;
  }
}

function fcfsCompare() {
  processes.sort(fcfs);
  for (let index = 0; index < processes.length; index++) {
    let process = processes[index];
    process.priority = index;
  }
}

function fcfs(x, y) {
  if (x.arrivalTime < y.arrivalTime) return -1;

  if (x.arrivalTime > y.arrivalTime) return 1;

  return 0;
}

function reset() {
  document.getElementById("ganttChart").innerHTML = "";
  document.getElementById("tableData").style.display = "none";
}
