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
  BT = [],
  Priority = [];
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
                  <!-- Iterate over Process, AT, BT, CT, TAT, and WT arrays -->
                  ${Process.map(
    (process, index) => `
                      <tr>
                          <td>${process[0]}</td>
                          <td>${AT[index][0]}</td>
                          <td>${BT[index][0]}</td>
                          <td>${CT0[index][0]}</td>
                          <td>${TAT0[index][0]}</td>
                          <td>${WT0[index][0]}</td>
                      </tr>
                  `
  ).join("")}
              </tbody>
          </table>
          <!-- Display average values -->
          <div class="average-values">
              <h3>Average Completion Time: ${avgct0}</h3>
              <h3>Average Turn Around Time: ${avgtat0}</h3>
              <h3>Average Waiting Time: ${avgwt0}</h3>
          </div>
      `;

  sortestJobFirst();
}


function sortestJobFirst() {
  let inp = parseInt(document.getElementById("inp_size").value);
  let gantt1 = [],
    CT1 = [],
    TAT1 = [],
    WT1 = [],
    time1 = [];
  let count1 = 0;

  let arr1 = [...AT];
  arr1.sort((a, b) => a[0] - b[0]);
  if (arr1[0][0] !== 0) {
    time1.push(0);
    gantt1.push("Idle");
  }
  count1 = arr1[0][0];
  time1.push(count1);
  while (arr1.length > 0) {
    let ind = [-1, -1],
      x = false;
    let i = 0,
      minBt = Number.MAX_SAFE_INTEGER;
    while (i < arr1.length && arr1[i][0] <= count1) {
      x = true;
      if (BT[arr1[i][1]][0] < minBt) {
        minBt = BT[arr1[i][1]][0];
        ind[0] = arr1[i][1];
        ind[1] = i;
      }
      i++;
    }
    if (x == false) {
      count1 = arr1[0][0];
      gantt1.push("Idle");
      time1.push(count1);
      continue;
    }
    arr1.splice(ind[1], 1);
    gantt1.push(Process[ind[0]][0]);
    count1 += BT[ind[0]][0];
    time1.push(count1);
    CT1.push([count1, ind[0]]);
    TAT1.push([count1 - AT[ind[0]][0], ind[0]]);
    WT1.push([count1 - AT[ind[0]][0] - BT[ind[0]][0], ind[0]]);
  }

  BT.sort((a, b) => a[1] - b[1]);
  CT1.sort((a, b) => a[1] - b[1]);
  TAT1.sort((a, b) => a[1] - b[1]);
  WT1.sort((a, b) => a[1] - b[1]);

  let tct1 = 0,
    avgct1 = 0,
    ttat1 = 0,
    avgtat1 = 0,
    twt1 = 0,
    avgwt1 = 0;
  for (let i = 0; i < inp; i++) {
    tct1 += CT1[i][0];
    twt1 += WT1[i][0];
    ttat1 += TAT1[i][0];
  }
  avgct1 = tct1 / inp;
  avgtat1 = ttat1 / inp;
  avgwt1 = twt1 / inp;

  const mainDiv = printOutput(gantt1, count1, time1);
  let parentDiv = document.getElementById("SJF");
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
                  <!-- Iterate over Process, AT, BT, CT, TAT, and WT arrays -->
                  ${Process.map(
    (process, index) => `
                      <tr>
                          <td>${process[0]}</td>
                          <td>${AT[index][0]}</td>
                          <td>${BT[index][0]}</td>
                          <td>${CT1[index][0]}</td>
                          <td>${TAT1[index][0]}</td>
                          <td>${WT1[index][0]}</td>
                      </tr>
                  `
  ).join("")}
              </tbody>
          </table>
          <!-- Display average values -->
          <div class="average-values">
              <h3>Average Completion Time: ${avgct1}</h3>
              <h3>Average Turn Around Time: ${avgtat1}</h3>
              <h3>Average Waiting Time: ${avgwt1}</h3>
          </div>
      `;

  sortestRemainingTimeFirst();
}


function sortestRemainingTimeFirst() {
  let inp = parseInt(document.getElementById("inp_size").value);
  let tq = parseInt(document.getElementById("tq").value);
  let gantt2 = [],
    CT2 = [],
    TAT2 = [],
    WT2 = [],
    time2 = [];
  let count2 = 0;
  let bt = deepCopy(BT),
    at = deepCopy(AT);
  at.sort((a, b) => a[0] - b[0]);
  if (at[0][0] !== 0) {
    time2.push(0);
    gantt2.push("Idle");
  }
  count2 = at[0][0];
  time2.push(count2);
  while (at.length > 0) {
    let ind = [-1, -1],
      x = false;
    let i = 0,
      minBt = Number.MAX_SAFE_INTEGER;
    while (i < at.length && at[i][0] <= count2) {
      x = true;
      if (bt[at[i][1]][0] < minBt) {
        minBt = bt[at[i][1]][0];
        ind[0] = at[i][1];
        ind[1] = i;
      }
      i++;
    }
    if (x == false) {
      count2 = at[0][0];
      gantt2.push("Idle");
      time2.push(count2);
      continue;
    }
    count2 += Math.min(tq, bt[ind[0]][0]);
    bt[ind[0]][0] -= Math.min(tq, bt[ind[0]][0]);
    if (gantt2[gantt2.length - 1] === Process[ind[0]][0]) {
      time2[time2.length - 1] = count2;
    } else {
      gantt2.push(Process[ind[0]][0]);
      time2.push(count2);
    }
    if (bt[ind[0]][0] <= 0) {
      at.splice(ind[1], 1);
      CT2.push([count2, ind[0]]);
      TAT2.push([count2 - AT[ind[0]][0], ind[0]]);
      WT2.push([count2 - AT[ind[0]][0] - BT[ind[0]][0], ind[0]]);
    }
  }
  CT2.sort((a, b) => a[1] - b[1]);
  TAT2.sort((a, b) => a[1] - b[1]);
  WT2.sort((a, b) => a[1] - b[1]);

  let tct2 = 0,
    avgct2 = 0,
    ttat2 = 0,
    avgtat2 = 0,
    twt2 = 0,
    avgwt2 = 0;
  for (let i = 0; i < inp; i++) {
    tct2 += CT2[i][0];
    twt2 += WT2[i][0];
    ttat2 += TAT2[i][0];
  }
  avgct2 = tct2 / inp;
  avgtat2 = ttat2 / inp;
  avgwt2 = twt2 / inp;

  const mainDiv = printOutput(gantt2, count2, time2);
  let parentDiv = document.getElementById("SRTF");
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
                  <!-- Iterate over Process, AT, BT, CT, TAT, and WT arrays -->
                  ${Process.map(
    (process, index) => `
                      <tr>
                          <td>${process[0]}</td>
                          <td>${AT[index][0]}</td>
                          <td>${BT[index][0]}</td>
                          <td>${CT2[index][0]}</td>
                          <td>${TAT2[index][0]}</td>
                          <td>${WT2[index][0]}</td>
                      </tr>
                  `
  ).join("")}
              </tbody>
          </table>
          <!-- Display average values -->
          <div class="average-values">
              <h3>Average Completion Time: ${avgct2}</h3>
              <h3>Average Turn Around Time: ${avgtat2}</h3>
              <h3>Average Waiting Time: ${avgwt2}</h3>
          </div>
      `;

  roundRobin();
}


function roundRobin() {
  let inp = parseInt(document.getElementById("inp_size").value);
  let tq = parseInt(document.getElementById("tq").value);
  let gantt3 = [],
    CT3 = [],
    TAT3 = [],
    WT3 = [],
    time3 = [],
    ready = [],
    pre = [];
  let count3 = 0;
  let bt = deepCopy(BT),
    at = deepCopy(AT);
  at.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < inp; i++) {
    pre.push(0);
  }
  if (at[0][0] !== 0) {
    time3.push(0);
    gantt3.push("Idle");
  }
  count3 = at[0][0];
  time3.push(count3);
  ready.push(at[0][1]);
  pre[at[0][1]] = 1;
  let ind = 0;
  while (ind < ready.length) {
    let i = 0;
    while (
      i < at.length &&
      at[i][0] <= count3 + Math.min(tq, bt[ready[ind]][0])
    ) {
      if (pre[at[i][1]] == 0) {
        ready.push(at[i][1]);
        pre[at[i][1]] = 1;
      }
      i++;
    }
    count3 += Math.min(tq, bt[ready[ind]][0]);
    bt[ready[ind]][0] -= Math.min(tq, bt[ready[ind]][0]);
    if (gantt3[gantt3.length - 1] === Process[ready[ind]][0]) {
      time3[time3.length - 1] = count3;
    } else {
      gantt3.push(Process[ready[ind]][0]);
      time3.push(count3);
    }
    if (bt[ready[ind]][0] <= 0) {
      CT3.push([count3, ready[ind]]);
      TAT3.push([count3 - AT[ready[ind]][0], ready[ind]]);
      WT3.push([count3 - AT[ready[ind]][0] - BT[ready[ind]][0], ready[ind]]);
    } else {
      ready.push(ready[ind]);
    }
    ind++;
    if (ind >= ready.length) {
      for (let i = 0; i < inp; i++) {
        if (at[i][0] > count3) {
          ready.push(at[i][1]);
          pre[at[i][1]] = 1;
          gantt3.push("Idle");
          count3 = at[i][0];
          time3.push(count3);
          break;
        }
      }
    }
  }
  CT3.sort((a, b) => a[1] - b[1]);
  TAT3.sort((a, b) => a[1] - b[1]);
  WT3.sort((a, b) => a[1] - b[1]);

  let tct3 = 0,
    avgct3 = 0,
    ttat3 = 0,
    avgtat3 = 0,
    twt3 = 0,
    avgwt3 = 0;
  for (let i = 0; i < inp; i++) {
    tct3 += CT3[i][0];
    twt3 += WT3[i][0];
    ttat3 += TAT3[i][0];
  }
  avgct3 = tct3 / inp;
  avgtat3 = ttat3 / inp;
  avgwt3 = twt3 / inp;

  let RQ = [];
  for (let i = 0; i < ready.length; i++) {
    RQ.push(Process[ready[i]][0]);
  }

  const mainDiv = printOutput(gantt3, count3, time3);
  let parentDiv = document.getElementById("RR");
  parentDiv.appendChild(mainDiv);

  const readyQ = document.createElement("div");
  readyQ.classList.add('FCFSOP');
  const label = document.createElement("h3");
  label.innerText = "Ready Queue:";
  readyQ.appendChild(label);
  const div1 = document.createElement("div");
  div1.style.display = "flex";
  div1.style.width = '80%';
  for (var i = 0; i < ready.length; i++) {
    const element = document.createElement("div");
    element.innerText = RQ[i];
    element.className = "gantt";
    element.style.width = (1 * 100) / ready.length + "%";
    div1.appendChild(element);
  }
  readyQ.appendChild(div1);
  parentDiv.appendChild(readyQ);

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
                  <!-- Iterate over Process, AT, BT, CT, TAT, and WT arrays -->
                  ${Process.map(
    (process, index) => `
                      <tr>
                          <td>${process[0]}</td>
                          <td>${AT[index][0]}</td>
                          <td>${BT[index][0]}</td>
                          <td>${CT3[index][0]}</td>
                          <td>${TAT3[index][0]}</td>
                          <td>${WT3[index][0]}</td>
                      </tr>
                  `
  ).join("")}
              </tbody>
          </table>
          <!-- Display average values -->
          <div class="average-values">
              <h3>Average Completion Time: ${avgct3}</h3>
              <h3>Average Turn Around Time: ${avgtat3}</h3>
              <h3>Average Waiting Time: ${avgwt3}</h3>
          </div>
      `;
}

