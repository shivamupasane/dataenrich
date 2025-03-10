import { createContext, useContext, useState } from 'react';
import ColorSelectorNode from './DataSource';
const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);
  console.log(children);
  console.log(ColorSelectorNode)
    if(type === 'dataSource'){
        return (
            <DnDContext.Provider value={[type, setType]}>
                {children}
            </DnDContext.Provider>
          );
    } else {
        return (
            <DnDContext.Provider value={[type, setType]}>
              {children}
            </DnDContext.Provider>
          );
    }
  
}

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
}