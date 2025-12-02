
import React, { useState, useCallback, useMemo, useContext } from 'react';

interface DataRefreshContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const DataRefreshContext = React.createContext<DataRefreshContextType>({
  refreshKey: 0,
  triggerRefresh: () => console.warn('triggerRefresh called outside of a DataRefreshProvider'),
});

export const useDataRefresh = () => useContext(DataRefreshContext);

export const DataRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const value = useMemo(() => ({ refreshKey, triggerRefresh }), [refreshKey, triggerRefresh]);

  return (
    <DataRefreshContext.Provider value={value}>
      {children}
    </DataRefreshContext.Provider>
  );
};
