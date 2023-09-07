export function generateMockData(clientIds, readings, timespread) {
    const mockData = [];
  
    for (const clientId of clientIds) {
      const startTime = Date.now() - timespread * 1000;
  
      for (let i = 0; i < readings; i++) {
        const randomTime = startTime + Math.random() * timespread * 1000;
  
        const randomTemp = Math.random() * 7 + 35;
        let color = "";
        if (randomTemp >= 35 && randomTemp <= 37) {
          color = "GREEN";
        } else if (randomTemp > 37 && randomTemp <= 38) {
          color = "ORANGE";
        } else if (randomTemp > 34 && randomTemp < 35) {
          color = "PURPLE";
        } else if (randomTemp === null) {
          color = "GRAY";
        } else {
          color = "RED";
        }
  
        mockData.push({
          patientId: clientId,
          time: new Date(randomTime).toJSON(),
          type: "TEMPERATURE_SENSOR_ONSKIN",
          value: {
            temperatureC: randomTemp,
            status: color,
          },
        });
      }
    }
  
    return mockData;
  }