export function createHealthChangeObject(patientId, lastStatusChange, prevPrevStatusChange) {
    return {
      patientId,
      healthChanged: true,
      changes: {
        timestamp: new Date(lastStatusChange.time),
        from: prevPrevStatusChange.value.status,
        to: lastStatusChange.value.status,
        value: lastStatusChange.value.temperatureC.toFixed(1),
      },
    };
  }