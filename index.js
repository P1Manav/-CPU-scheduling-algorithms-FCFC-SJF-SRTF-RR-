function printOutput(gantt0, count0, time0) {
    // Create a main div with class FCFSOP
    const mainDiv = document.createElement("div");

    const label = document.createElement("h3");
    label.innerText = "Gantt Chart:";
    mainDiv.appendChild(label);

    mainDiv.classList.add("FCFSOP");

    const div1 = document.createElement("div");
    div1.style.display = "flex";
    // Loop through the array and append each element inside the main div
    for (var i = 0; i < gantt0.length; i++) {
      const element = document.createElement("div");
      element.innerText = gantt0[i]; // Using innerText instead of textContent
      element.id = "g_" + i; // Assigning unique ID
      element.className = "gantt"; // Assigning class name
      const duration = time0[i + 1] - time0[i];
      element.style.width = (duration * 100) / count0 + "%"; // Setting width
      div1.appendChild(element);
    }
    mainDiv.appendChild(div1);

    const div2 = document.createElement("div");
    div2.style.display = "flex";
    for (var i = 1; i < time0.length; i++) {
      const element = document.createElement("div");
      const para = document.createElement("p");
      para.innerText = time0[i];
      para.style.display = "absolute";
      para.className = "para";
      element.appendChild(para);
      element.id = "t_" + i; // Assigning unique ID
      element.className = "time"; // Assigning class name
      const duration = time0[i] - time0[i - 1];
      element.style.width = (duration * 100) / count0 + "%"; // Setting width
      div2.appendChild(element);
    }

    mainDiv.appendChild(div2);
    return mainDiv;
}


function deepCopy(arr) {
  let copy = [];
  arr.forEach((elem) => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem));
    } else if (typeof elem === "object" && elem !== null) {
      copy.push(deepCopyObject(elem));
    } else {
      copy.push(elem);
    }
  });
  return copy;
}


let Process = [],
  AT = [],
  BT = [];
let TQ = null;


function inputFields() {
  const inp = parseInt(document.getElementById("inp_size").value);
  const inputRows = document.getElementById("inputRows");
  inputRows.innerHTML = "";

  for (let i = 0; i < inp; i++) {
    inputRows.innerHTML += `
            <tr>
                <td><input type="text" id="process_${i}" placeholder="Process ${i}"></td>
                <td><input type="number" id="AT_${i}" placeholder="AT ${i}"></td>
                <td><input type="number" id="BT_${i}" placeholder="BT ${i}"></td>
            </tr>
        `;
  }

  document.getElementById("inp_table").style.display = "block";
  document.querySelector("button").style.display = "none";
  document.getElementById("cal").style.display = "block";
}


function arrayInput() {
  const inp = parseInt(document.getElementById("inp_size").value);
  TQ = parseInt(document.getElementById("tq").value);
  for (let i = 0; i < inp; i++) {
    const element = document.getElementById(`process_${i}`).value.trim();
    if (element !== "") {
      Process.push([element, i]);
    }
  }
  for (let i = 0; i < inp; i++) {
    const element = parseInt(document.getElementById(`AT_${i}`).value);
    if (element !== "") {
      AT.push([element, i]);
    }
  }
  for (let i = 0; i < inp; i++) {
    let element = parseInt(document.getElementById(`BT_${i}`).value);
    BT.push([element, i]);
  }
  firstComeFirstServe();
}


function firstComeFirstServe() {
  let inp = parseInt(document.getElementById("inp_size").value);
  AT.sort((a, b) => a[0] - b[0]);
  let gantt0 = [],
    CT0 = [],
    TAT0 = [],
    WT0 = [],
    time0 = [];
  let count0 = 0;
  if (AT[0][0] !== 0) {
    time0.push(0);
    gantt0.push("Idle");
  }
  count0 = AT[0][0];
  time0.push(count0);
  for (let i = 0; i < inp; i++) {
    console.log(count0 + " " + AT[i][0]);
    if (count0 < AT[i][0]) {
      count0 = AT[i][0];
      gantt0.push("Idle");
      time0.push(count0);
    }
    gantt0.push(Process[AT[i][1]][0]);
    count0 += BT[AT[i][1]][0];
    time0.push(count0);
    CT0.push([count0, AT[i][1]]);
    TAT0.push([count0 - AT[i][0], AT[i][1]]);
    WT0.push([count0 - AT[i][0] - BT[AT[i][1]][0], AT[i][1]]);
  }
  AT.sort((a, b) => a[1] - b[1]);
  CT0.sort((a, b) => a[1] - b[1]);
  TAT0.sort((a, b) => a[1] - b[1]);
  WT0.sort((a, b) => a[1] - b[1]);

  let tct0 = 0,
    avgct0 = 0,
    ttat0 = 0,
    avgtat0 = 0,
    twt0 = 0,
    avgwt0 = 0;
  for (let i = 0; i < inp; i++) {
    tct0 += CT0[i][0];
    twt0 += WT0[i][0];
    ttat0 += TAT0[i][0];
  }
  avgct0 = tct0 / inp;
  avgtat0 = ttat0 / inp;
  avgwt0 = twt0 / inp;

  const mainDiv = printOutput(gantt0, count0, time0);
  let parentDiv = document.getElementById("FCFS");
  parentDiv.appendChild(mainDiv);

  parentDiv.innerHTML += `
            <h3>Process Table:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Process</th>
                        <th>Arrival Time</th>
                        <th>Burst Time</th>
                        <th>Completion Time</th>
                        <th>Turn Around Time</th>
                        <th>Waiting Time</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Iterate over each process to display details -->
                    ${AT.map((elem, i) => `
                        <tr>
                            <td>${Process[i][0]}</td>
                            <td>${elem[0]}</td>
                            <td>${BT[i][0]}</td>
                            <td>${CT0[i][0]}</td>
                            <td>${TAT0[i][0]}</td>
                            <td>${WT0[i][0]}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <h3>Average Turn Around Time (TAT): ${avgtat0}</h3>
            <h3>Average Waiting Time (WT): ${avgwt0}</h3>
            <h3>Average Completion Time (CT): ${avgct0}</h3>
        `;
}
