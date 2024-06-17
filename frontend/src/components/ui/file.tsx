import { ReactNode, createContext, useContext, useReducer } from "react";

enum FileActionType {
  SET_FILE = "SET_FILE",
  UPLOAD_START = "UPLOAD_START",
  UPLOAD_SUCCESS = "UPLOAD_SUCCESS",
  UPLOAD_ERROR = "UPLOAD_ERROR",
  FETCHING_FILES = "FETCHING_FILES",
  FETCH_FILES_SUCCESS = "FETCH_FILES_SUCCESS",
  FETCH_FILES_ERROR = "FETCH_FILES_ERROR"
}

type ReducerAction<T, P> = {
  type: T;
  payload?: Partial<P>;
};


type FileContextState = {
  isLoading: boolean;
  file: File | null;
  fileList: FileItem[];
  filesCount: number;
};

type FileAction = ReducerAction<
  FileActionType,
  Partial<FileContextState>
>;

type FileDispatch = ({ type, payload }: FileAction) => void;

type FileContextType = {
  state: FileContextState;
  dispatch: FileDispatch;
};

type FileProviderProps = { children: ReactNode };

interface FileItem {
  id: string;
  name: string;
  type: string;
  created_at: string;
  path: string;
}

export const FileContextInitialValues: Partial<FileContextState> = {
  file: null,
  isLoading: false,
  fileList: [],
  filesCount: 0,
};

const FileContext = createContext({} as FileContextType);

const FileReducer = (
  state: FileContextState,
  action: FileAction,
): FileContextState => {
  switch (action.type) {
    case FileActionType.SET_FILE: {
      return { ...state, file: action.payload?.file as File };
    }
    case FileActionType.UPLOAD_START: {
      return { ...state, isLoading: true };
    }
    case FileActionType.UPLOAD_SUCCESS: {
      return { ...state, isLoading: false, file: null };
    }
    case FileActionType.UPLOAD_ERROR: {
      return { ...state, isLoading: false };
    }
    case FileActionType.FETCHING_FILES: {
      return { ...state, isLoading: false };
    }
    case FileActionType.FETCH_FILES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        fileList: action.payload?.fileList as FileItem[],
        filesCount: action.payload?.filesCount as number,
      };
    }
    case FileActionType.FETCH_FILES_ERROR: {
      return { ...state, isLoading: false };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const FileProvider = ({ children }: FileProviderProps) => {
  const [state, dispatch] = useReducer(
    FileReducer,
    FileContextInitialValues as FileContextState,
  );

  return (
    <FileContext.Provider value={{ state, dispatch }}>
      {children}
    </FileContext.Provider>
  );
};

const useFileContext = () => {
  const context = useContext(FileContext);

  if (context === undefined)
    throw new Error("useFileContext must be used within a FileProvider");

  return context;
};

export { FileProvider, useFileContext, FileActionType };