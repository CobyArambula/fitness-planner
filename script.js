const calendar = document.querySelector(".calendar"),
  container = document.querySelector(".container"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  monthClass = document.querySelector(".month"),
  weekdaysDaysContainer = document.querySelector(".weekdays-days-container");

let activities = new Array();
let activityDates = [[]];
let data;
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function initCalendar(activityDates) {
  const firstDay = new Date(year, month, 1); // First date of current month as Date object
  const lastDay = new Date(year, month + 1, 0); // Last date of current month as Date object
  const prevLastDay = new Date(year, month, 0); // Last date of prev month as Date object
  const prevDays = prevLastDay.getDate(); // Last date of prev month as number
  const lastDate = lastDay.getDate(); // Last date of current month
  const day = firstDay.getDay(); // How many days in the prev month to display
  const nextDays = 7 - lastDay.getDay() - 1; // How many days in the next month to display

  date.innerHTML = months[month] + " " + year;

  // if day contains event, then day should get event class, and corresponding event data should be attached
  let days = "";

  // for previous days
  // TODO: add logic for if prev day = activity day
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  // current month days
  for (let i = 1; i <= lastDate; i++) {
    // if day is today add class today
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      days += `<div class="day today event"> ${i}</div>`;
    } else {
      days += `<div class="day"> ${i}</div>`;
    }
  }

  // next month days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
}

// previous month
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

// add event listener on prev and next
prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

// Call server to retrieve items from DynamoDB table and push them in activities array
async function loadActivityData() {
  try {
    const response = await fetch("http://localhost:3000/getDynamoData");
    data = await response.json();
    data.forEach((item) => {
      activities.push(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Need to parse days from activity array
// if activityArrayDate == day, add active class to day
function getActivityDates() {
  activities.forEach((activity) => {
    const activityString = activity.Id;
    // Uses a regex and capturing groups to extract year, month, and day
    const regex = /(\d{4})-(\d{2})-(\d{2})/;
    const match = regex.exec(activityString);
    const year = match[1];
    const month = match[2];
    const day = match[3];
    const activityDate = new Date(year, month, day);
    activityDates.push(activityDate);
  });
}

loadActivityData().then(() => {
  getActivityDates();
  initCalendar(activityDates);
});
