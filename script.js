
function createCalendar() {
  const monthsNameArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsData = [];
  for (let i = 0; i < monthsNameArr.length; i++) {
    const num = i + 1;
    monthsData.push({
      monthName: monthsNameArr[i], 
      countOfDays: getCountOfDays(num),
      lastNum: i - 1,
      nextNum: num
    });
  }

  createCalendarView({activeSetData: monthsData[new Date().getMonth()], activeYear: new Date().getFullYear()}, monthsData);
}

function getCountOfDays(month = new Date().getMonth(), year = new Date().getFullYear()) {
  return new Date(year , month, 0).getDate();
}

function createCalendarView(showData, monthsData) {
  const wrapper = document.querySelector('#wrapper');
  const calendarParent = document.createElement('div');
  calendarParent.setAttribute('id', 'calendar-parent');
  calendarParent.classList.add('hide-out');

  createCalendarViewConstr();

  function createCalendarViewConstr() {
    calendarParent.innerHTML = `
      <div id="calendar-first-side">
          <div id="calendar-info">
            <span id="active-month">${showData.activeSetData.monthName},</span>
            <span id="active-year">${showData.activeYear}</span>
          </div>
          <div id="calendar-arrows_parent">
            <div id="calendar-last">
              <img src="./icons/last-arrow.png">
            </div>
            <div id="calendar-next">
              <img src="./icons/next-arrow.png">
            </div>
          </div>
      </div>
    `;
  }

  const calendarSecondSideEl = document.createElement('div');
  calendarSecondSideEl.setAttribute('id', 'calendar-second-side');
  calendarSecondSideEl.appendChild(createCalendarSecondSideWeekDays());
  function createCalendarSecondSideWeekDays() {
    const weekNameArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDaysParent = document.createElement('div');
    weekDaysParent.setAttribute('id', 'week-day_parent');
    weekNameArr.forEach(item => {
      const weekDayEl = document.createElement('div');
      weekDayEl.classList.add('week-day-item');
      weekDayEl.textContent = item;
      weekDaysParent.appendChild(weekDayEl);  
    });

    return weekDaysParent;
  }

// Variables for compare really day.
  const activeDay = new Date().getDate();
  const activeMonthNum = new Date().getMonth() + 1;
  const activeYearNum = new Date().getFullYear();

  calendarParent.appendChild(calendarSecondSideEl);
  wrapper.appendChild(calendarParent);

  calendarParent.appendChild(calendarSecondSideEl);
  wrapper.appendChild(calendarParent);

  const weekDaysEl = document.querySelectorAll('.week-day-item');

  for (let i = 1; i <= showData.activeSetData.countOfDays; i++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day-item');
    dayEl.textContent = i;
    
    if (activeMonthNum === showData.activeSetData.nextNum && activeYearNum === showData.activeYear && activeDay === i) {
      dayEl.classList.add('active-day');
    }

    const weekNum = getWeekDay(showData.activeYear, showData.activeSetData.nextNum - 1, i);
    if (i === 1 && weekNum > 0) {
      appendAdditionalInStart(weekNum, getCountOfDays(showData.activeSetData.nextNum - 1, showData.activeYear));
    }

    if (showData.activeSetData.countOfDays === i) {
      appendAdditionalInEnd(weekNum);
    }
    weekDaysEl[weekNum].appendChild(dayEl);
  }

  const lastArrowEl = document.querySelector('#calendar-last');
  const nextArrowEl = document.querySelector('#calendar-next');

  lastArrowEl.addEventListener('click', function() {
    calendarParent.classList.add('hide-in')
    calendarParent.classList.remove('hide-out');
    setTimeout(() => {
      wrapper.innerHTML = "";
      let setYear;
      if (showData.activeSetData.nextNum === 1) {
        setYear = showData.activeYear - 1;
      } else {
        setYear = showData.activeYear;
      }

      if (showData.activeSetData.nextNum === 1) {
        setMonth = 11;
      } else {
        setMonth = showData.activeSetData.lastNum;
      }

      if (showData.activeSetData.lastNum === 1) {
        monthsData[1].countOfDays = getCountOfDays(2, setYear);
      }

      createCalendarView({activeSetData: monthsData[setMonth], activeYear: setYear}, monthsData);
    }, 600);
  });

  nextArrowEl.addEventListener('click', function () {
    // calendarParent.innerHTML = "";
    calendarParent.classList.add('hide-in')
    calendarParent.classList.remove('hide-out');
    setTimeout(() => {
      wrapper.innerHTML = ""
      let setYear;
      if (showData.activeSetData.nextNum === 12) {
        setYear = showData.activeYear + 1;
      } else {
        setYear = showData.activeYear;
      }

      let setMonth;
      if (showData.activeSetData.nextNum === 12) {
        setMonth = 0;
      } else {
        setMonth = showData.activeSetData.nextNum;
      }

      if (showData.activeSetData.nextNum === 1) {
        monthsData[1].countOfDays = getCountOfDays(2, setYear);
      }

      createCalendarView({activeSetData: monthsData[setMonth], activeYear: setYear}, monthsData);
    }, 600);
  });
}

function appendAdditionalInStart(num, oldNum) {
  const weekDaysEl = document.querySelectorAll('.week-day-item');
  let j = 0; // for get Array.
  for (let i = oldNum - num + 1; i <= oldNum; i++) {
    const addDayEl = document.createElement('div');
    addDayEl.classList.add('add-start-day-item', 'aditional-item');
    addDayEl.textContent = i;
    weekDaysEl[j].appendChild(addDayEl);
    j++;
  }
}

function appendAdditionalInEnd(weekNum) {
  const weekDaysEl = document.querySelectorAll('.week-day-item');
  let j = 1;
  for (let i = weekNum + 1; i <= 6; i++) {
    const addDayEl = document.createElement('div');
    addDayEl.classList.add('add-end-day-item', 'aditional-item');
    addDayEl.textContent = j;
    weekDaysEl[i].appendChild(addDayEl);
    j++;
  }
}

function getWeekDay(year, month, day) {
  return new Date(year, month, day, 0).getDay();
}

createCalendar();