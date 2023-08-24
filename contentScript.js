const 사전선택인원위치 = () => {
  for (let idx = 0; idx < tHeadEle.length; idx++) {
    const element = tHeadEle[idx];
    if (element.textContent.indexOf("사전선택인원") !== -1) {
      return idx;
    }
  }
};
const 테이블헤더추가 = (n) => {
  const th = document.createElement("th");
  th.innerHTML = "경쟁률<br>(4/3/2/1/추가)";
  tHead[0].insertBefore(th, tHeadEle[n + 2]);
};

const 경쟁률계산후추가 = (n) => {
  const 테이블바디추가 = (seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate, idx) => {
    const info = document.createElement("td");
    info.className = "center";
    info.textContent = `${seniorRate}/${juniorRate}/${sophomoreRate}/${freshmanRate}/${allRate}`;
    let tBodyBlock = document.querySelectorAll(`.table0.mato15 table tbody tr:nth-child(${idx + 1}) td`);
    //병합되어있는지 확인
    const rowspan = tBodyBlock[n].getAttribute("rowspan");
    if (rowspan !== null) {
      info.rowSpan = tBodyBlock[n].getAttribute("rowspan");
      tBody[idx].insertBefore(info, tBodyBlock[n + 2]);
      idx += Number(rowspan) - 1;
    } else {
      tBody[idx].insertBefore(info, tBodyBlock[n + 2]);
    }
    return idx;
  };

  const 경쟁률계산 = (선택인원, 가능인원) => {
    if (가능인원 === 0) return "X";
    if (선택인원 === 0) return 0;
    return 소수점설정(선택인원 / 가능인원);
  };
  const 누적인원갱신 = (선택인원, 가능인원, 실패인원) => {
    if (가능인원 === 0) return [0, 실패인원 + 선택인원];
    if (선택인원 === 0) return [가능인원, 실패인원];
    if (선택인원 >= 가능인원) return [0, 실패인원 + 선택인원 - 가능인원];
    return [가능인원 - 선택인원, 실패인원];
  };
  const 소수점설정 = (rate) => {
    if (rate > 0 && rate <= 0.1) return 0.1; //0과 구분위해 0초과부터 ~ 0.1이하는 0.1
    if (rate >= 0.9 && rate < 1) return 0.9; //인원초과인지 아닌지 구분위해 0.9이상부터 ~ 1미만은 0.9
    if (rate > 1 && rate <= 1.1) return 1.1; //1과 구분위해 1초과부터 ~ 1.1이하는 1.1
    return (Math.round(rate * 10) / 10).toFixed(1); //나머지는 소수점 첫째자리에서 반올림
  };

  for (let idx = 0; idx < tBody.length; idx++) {
    const element = tBody[idx];
    const [seniorPick, juniorPick, sophomorePick, freshmanPick] = element
      .querySelector(`td:nth-child(${n + 1})`)
      .textContent.split("/")
      .map(Number);
    const [seniorFull, juniorFull, sophomoreFull, freshmanFull, allFull] = element
      .querySelector(`td:nth-child(${n + 2})`)
      .textContent.split("/")
      .map(Number);
    const [seniorAble, juniorAble, sophomoreAble, freshmanAble, allAble] = [
      seniorFull,
      juniorFull - seniorFull,
      sophomoreFull - juniorFull,
      freshmanFull - sophomoreFull,
      allFull - freshmanFull,
    ];

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
    idx = 테이블바디추가(seniorRate, juniorRate, sophomoreRate, freshmanRate, allRate, idx);
  }
};

//=============================================================

let tHead = document.querySelectorAll(".table0.mato15 table thead tr");
let tBody = document.querySelectorAll(".table0.mato15 table tbody tr");
let tHeadEle = document.querySelectorAll(".table0.mato15 table thead tr th");
if (tHead.length !== 0) {
  let n = 사전선택인원위치();
  테이블헤더추가(n);
  경쟁률계산후추가(n);
}

//색깔 추가
//추가신청경쟁률은 학년별신청에 실패한 인원 모두가 추가신청에 도전한다는 가정하에 나온 경쟁률입니다.
