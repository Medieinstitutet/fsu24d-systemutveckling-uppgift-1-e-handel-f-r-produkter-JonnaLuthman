export const addTimestamps = (data) => {
    const timestamp = new Date();
    return {
      ...data,
      created_at: timestamp,
      updated_at: timestamp,
    };
  };

  export const updateTimestamp = (data) => ({
    ...data,
    updated_at: new Date(),
  });
  