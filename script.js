import { latest_health_readings } from "./mockData.js";
import { createHealthChangeObject } from "./utils/createHealthChangeObject.js";
import { HEALTH_READING_INTERVAL, validStatusTransitions } from "./utils/constants.js";
import { generateMockData } from "./utils/generateFunction.js";

function saveChanges(latest_health_readings) {
  const sorted = latest_health_readings.sort(
    (a, b) => new Date(a.time) - new Date(b.time)
  );
  sorted.sort((a, b) => a.patientId - b.patientId);
  return sorted;
}

function groupChangesByPatient(changes) {
  const changesByPatient = {};
  for (const change of changes) {
    if (!changesByPatient[change.patientId]) {
      changesByPatient[change.patientId] = [];
    }
    changesByPatient[change.patientId].push(change);
  }
  return changesByPatient;
}

function isHealthChange(change1, change2) {
  return change1.value.status !== change2.value.status;
}

function calculateTimeDifferenceHours(change1, change2) {
  const timestamp1 = new Date(change1.time);
  const timestamp2 = new Date(change2.time);
  return (timestamp2 - timestamp1) / (1000 * HEALTH_READING_INTERVAL);
}

function checkHealthChanges(changes) {
  const results = [];
  const changesByPatient = groupChangesByPatient(changes);

  for (const patientId in changesByPatient) {
    const patientChanges = changesByPatient[patientId];
    const numChanges = patientChanges.length;

    if (numChanges <= 1) {
      continue;
    }

    const lastStatusChange = patientChanges[numChanges - 1];
    const prevStatusChange = patientChanges[numChanges - 2];

    const timeDifferenceHours = calculateTimeDifferenceHours(
      prevStatusChange,
      lastStatusChange
    );

    const isTransitionValid = validStatusTransitions.some((transition) => {
      return (
        transition.from === prevStatusChange.value.status &&
        transition.to === lastStatusChange.value.status
      );
    });

    if (!isTransitionValid || timeDifferenceHours >= 1) {
      results.push({
        patientId,
        healthChanged: false,
        last: {
          timestamp: new Date(lastStatusChange.time),
          status: lastStatusChange.value.status,
          value: lastStatusChange.value.temperatureC.toFixed(1),
        },
      });
    } else if (isHealthChange(prevStatusChange, lastStatusChange)) {
      results.push(
        createHealthChangeObject(patientId, lastStatusChange, prevStatusChange)
      );
    } else if (numChanges >= 3) {
      const prevPrevStatusChange = patientChanges[numChanges - 3];
      const timeDifferencePrevPrevHours = calculateTimeDifferenceHours(
        prevPrevStatusChange,
        prevStatusChange
      );

      const isPrevPrevTransitionValid = validStatusTransitions.some(
        (transition) => {
          return (
            transition.from === prevPrevStatusChange.value.status &&
            transition.to === prevStatusChange.value.status
          );
        }
      );

      if (
        timeDifferencePrevPrevHours < 1 &&
        isHealthChange(prevPrevStatusChange, lastStatusChange) &&
        isPrevPrevTransitionValid
      ) {
        results.push(
          createHealthChangeObject(
            patientId,
            lastStatusChange,
            prevPrevStatusChange
          )
        );
      }
    }
  }

  return results;
}

const sortedChanges = saveChanges(latest_health_readings);
console.log(sortedChanges);
console.log(checkHealthChanges(sortedChanges));
