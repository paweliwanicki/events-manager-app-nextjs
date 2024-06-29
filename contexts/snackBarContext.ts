import { ReactNode, createContext, useContext } from 'react';
import { SnackBarVariant } from '../components/providers/SnackBarProvider';

type SnackBarContextType = {
  content: ReactNode;
  isShowing: boolean;
  variant: SnackBarVariant;
  setIsShowing: (show: boolean) => void;
  setContent: (content: ReactNode) => void;
  handleShowSnackBar: (content: ReactNode, variant: SnackBarVariant) => void;
};

export const SnackBarContext = createContext<SnackBarContextType>({
  content: undefined,
  isShowing: false,
  variant: 'info',
  setIsShowing: () => undefined,
  setContent: () => undefined,
  handleShowSnackBar: () => undefined,
});

export const useSnackBar = () => useContext(SnackBarContext);
