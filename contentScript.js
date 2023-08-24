const 선택인원제한인원위치 = () => {
  let prePickN, limitPickM;
  for (let idx = 0; idx < tHeadEle.length; idx++) {
    const element = tHeadEle[idx];
    if (element.textContent.indexOf("사전선택인원") !== -1) prePickN = idx;
    if (element.textContent.indexOf("제한인원") !== -1) limitPickM = idx;
  }
  return [prePickN, limitPickM];
};

const 테이블헤더추가 = (m) => {
  const th = document.createElement("th");
  th.innerHTML = "경쟁률<br>(4/3/2/1/추가)";
  tHead[0].insertBefore(th, tHeadEle[m + 1]);
};

const 테이블바디추가 = (seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate, idx, m) => {
  const info = 바디생성(seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate);
  let tBodyBlock = document.querySelectorAll(`.table0.mato15 table tbody tr:nth-child(${idx + 1}) td`);
  const rowspan = tBodyBlock[m + 1].getAttribute("rowspan");
  if (rowspan !== null) {
    info.rowSpan = tBodyBlock[m + 1].getAttribute("rowspan");
    tBody[idx].insertBefore(info, tBodyBlock[m + 1]);
    idx += Number(rowspan) - 1;
    return idx;
  }
  tBody[idx].insertBefore(info, tBodyBlock[m + 1]);
  return idx;
};

function 바디생성(seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate) {
  const info = document.createElement("td");
  info.className = "center";
  info.textContent = `${seniorRate}/${juniorRate}/${sophomoreRate}/${freshmanRate}/${allRate}`;
  return info;
}

const 경쟁률계산 = (선택인원, 가능인원) => {
  if (가능인원 === 0) return "X";
  if (선택인원 === 0) return 0;
  return 소수점설정(선택인원 / 가능인원);
};

const 소수점설정 = (rate) => {
  if (rate > 0 && rate <= 0.1) return 0.1; //0과 구분위해 0초과부터 ~ 0.1이하는 0.1
  if (rate >= 0.9 && rate < 1) return 0.9; //인원초과인지 아닌지 구분위해 0.9이상부터 ~ 1미만은 0.9
  if (rate > 1 && rate <= 1.1) return 1.1; //1과 구분위해 1초과부터 ~ 1.1이하는 1.1
  return (Math.round(rate * 10) / 10).toFixed(1); //나머지는 소수점 첫째자리에서 반올림
};

const 누적인원갱신 = (선택인원, 가능인원, 실패인원) => {
  if (가능인원 === 0) return [0, 실패인원 + 선택인원];
  if (선택인원 === 0) return [가능인원, 실패인원];
  if (선택인원 >= 가능인원) return [0, 실패인원 + 선택인원 - 가능인원];
  return [가능인원 - 선택인원, 실패인원];
};

const 경쟁률계산후추가 = (n, m) => {
  for (let idx = 0; idx < tBody.length; idx++) {
    const element = tBody[idx];
    const [seniorPick, juniorPick, sophomorePick, freshmanPick] = element
      .querySelector(`td:nth-child(${n + 1})`)
      .textContent.split("/")
      .map(Number);
    const limitPick = element
      .querySelector(`td:nth-child(${n + 2})`)
      .textContent.split("/")
      .map(Number);
    const [seniorAble, juniorAble, sophomoreAble, freshmanAble, allAble] = limitPick.map((limitP, idx, arr) =>
      idx === 0 ? limitP : limitP - arr[idx - 1]
    );
    let fail = 0;
    let seatsLeftOver = 0;
    let seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate;
    [seniorRate, juniorRate, sophomoreRate, freshmanRate] = [
      [seniorPick, seniorAble],
      [juniorPick, juniorAble],
      [sophomorePick, sophomoreAble],
      [freshmanPick, freshmanAble],
    ].map(([pick, able]) => {
      let rate = 경쟁률계산(pick, able + seatsLeftOver);
      [seatsLeftOver, fail] = 누적인원갱신(pick, able + seatsLeftOver, fail);
      return rate;
    });
    allRate = 경쟁률계산(fail, allAble + seatsLeftOver);
    idx = 테이블바디추가(seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate, idx, m);
  }
};

//=============================================================

let tHead = document.querySelectorAll(".table0.mato15 table thead tr");
let tBody = document.querySelectorAll(".table0.mato15 table tbody tr");
let tHeadEle = document.querySelectorAll(".table0.mato15 table thead tr th");
if (tHead.length !== 0) {
  let [n, m] = 선택인원제한인원위치();
  테이블헤더추가(m);
  경쟁률계산후추가(n, m);
}

//색깔 추가
//추가신청경쟁률은 학년별신청에 실패한 인원 모두가 추가신청에 도전한다는 가정하에 나온 경쟁률입니다.
