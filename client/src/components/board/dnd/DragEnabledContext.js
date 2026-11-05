// True while cards may be dragged (false while the task modal or drawer is open); read by DraggableCard.
import { createContext } from 'react';

const DragEnabledContext = createContext(true);

export default DragEnabledContext;
