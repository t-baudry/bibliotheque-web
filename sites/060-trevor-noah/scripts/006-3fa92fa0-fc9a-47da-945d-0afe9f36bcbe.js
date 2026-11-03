
      function calculateTBT(longTaskDurations) {
        return longTaskDurations
          .filter((duration) => duration > 50)
          .reduce((sum, duration) => sum + (duration - 50), 0);
      }
      
      self.addEventListener('message', (e) => {
        const { type, data } = e.data;
        if (type === 'CALCULATE_TBT') {
          const tbt = calculateTBT(data);
          self.postMessage({ type: 'TBT_CALCULATED', data: tbt });
        }
      });
    