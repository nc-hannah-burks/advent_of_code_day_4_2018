function getMostAsleepGuardProduct(guardChart) {
  if (guardChart.length === 0) {
    return 0;
  }
  //organise data so each Guard has an array of their sleep and wakeup times
  const organisedGuardsData = organiseGuardsData(guardChart);
  //work out most asleep time and return their guard ID
  const mostAsleepGuardId = findLongestSleepingGuard(organisedGuardsData);

  //get guard who is most asleep's data Array
  const guardSchedule = organisedGuardsData[mostAsleepGuardId];

  //get minutes from each data string
  const sleepingMins = guardSchedule.map((guard) => {
    const minutes = guard.match(/\d\d\:(\d\d)/g)[0].split(":")[1];
    return minutes;
  });

  //look up object to store how many times the guard was asleep for that minute
  const loggedAsleepMinutes = {};
  sleepingMins.forEach((min, index) => {
    if (index % 2 == 0) {
      while (+min < +sleepingMins[index + 1]) {
        loggedAsleepMinutes.hasOwnProperty(min)
          ? loggedAsleepMinutes[min]++
          : (loggedAsleepMinutes[min] = 1);
        min++;
      }
    }
  });
  //find which minute has highest occurance by iterating over lookup obj
  let mostFreqCount = 0;
  let mostFreqMinute = 0;
  for (key in loggedAsleepMinutes) {
    if (loggedAsleepMinutes[key] > mostFreqCount) {
      mostFreqCount = loggedAsleepMinutes[key];
      mostFreqMinute = key;
    }
  }
  //multiply most frequent minute by guards ID
  return mostFreqMinute * mostAsleepGuardId;
}
module.exports = { getMostAsleepGuardProduct };

function organiseGuardsData(guardChart) {
  const guardsData = {};
  let currGuard = "";
  guardChart.forEach((guardLog, index) => {
    if (guardLog.includes("begins shift")) {
      //get guard ID without the hashtag
      currGuard = guardLog.match(/#\d+/g)[0].split("#")[1];
      if (!guardsData.hasOwnProperty([currGuard])) {
        guardsData[currGuard] = [];
      }
    } else {
      guardsData[currGuard].push(guardLog);
    }
  });
  return guardsData;
}

function findLongestSleepingGuard(guardsData) {
  let longestSleepingGuardID = 0;
  let longestSleepSum = 0;

  for (let key in guardsData) {
    let sleepSum = 0;
    for (let i = 0; i < guardsData[key].length; i += 2) {
      sleepSum += guardsData[key][i + 1]
        .match(/\d\d\:(\d\d)/g)[0]
        .split(":")[1] -= guardsData[key][i]
        .match(/\d\d\:(\d\d)/g)[0]
        .split(":")[1];
    }

    if (sleepSum > longestSleepSum) {
      longestSleepSum = sleepSum;
      longestSleepingGuardID = +key;
    }
  }

  return longestSleepingGuardID;
}
