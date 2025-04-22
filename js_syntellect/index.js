const calculateDays4TurpleWay = (fullWay, wayPerDay, rollDown) => {
  if ((fullWay < 0 && wayPerDay > rollDown) || (fullWay > 0 && wayPerDay < rollDown)) {
    return Number.NaN
  }
  // альтернатива
  // return Math.ceil(fullWay / (wayPerDay - rollDown)) - Math.floor(wayPerDay / (wayPerDay - rollDown)) + 1
  // return Math.ceil((fullWay - rollDown) / (wayPerDay - rollDown))

  let day = 1
  // используется break
  for (let height = wayPerDay; height < fullWay; height += wayPerDay, day += 1) {
    if (height >= fullWay) {
      break
    }
    height -= rollDown
  }

  return day
}

const calculateHandshakes = (peopleCount) => {
  if (peopleCount <= 1) {
    return 0
  }

  // альтернатива
  // return (peopleCount - 1) * peopleCount / 2

  let counter = 0
  for (let i = 1; i < peopleCount; i += 1, counter += i - 1) { }

  return counter
}

const removeDoubles = (list) => [...new Set(list.split(','))].join(',')

const FULL_WAY = 100
const WAY_PER_DAY = 50
const ROLL_DOWN = 30

const PEOPLE_COUNT = 10
console.log(`Ответ 1: На столб черепашка никогда не залезет, но на вершину холма на ${calculateDays4TurpleWay(FULL_WAY, WAY_PER_DAY, ROLL_DOWN)} сутки`)
console.log(`Ответ 2: Это сочетания по 2 (${PEOPLE_COUNT}!/(2!*(${PEOPLE_COUNT}-2)!) = (${PEOPLE_COUNT}-1) * ${PEOPLE_COUNT} / 2); ${calculateHandshakes(PEOPLE_COUNT)}`)