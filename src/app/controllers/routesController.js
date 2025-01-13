export const calculerTarif = async (distance, duration, dateTime) => {
    try {
      const response = await fetch("http://localhost:4000/api/calculer-tarif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ distance, duration, dateTime }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to calculate fare");
      }
  
      const data = await response.json();
      return data.fare;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };