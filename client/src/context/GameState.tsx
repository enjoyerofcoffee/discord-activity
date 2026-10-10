import { createContext, useContext, useReducer, type Dispatch } from "react";

type Status = "normal" | "duplicate" | "error" | "finished";

type GameState = {
  guesses: number;
  history: string[];
  status: Status;
};

type GameStateAction = { type: "guess"; payload: string };

const GameStateContext = createContext<GameState | undefined>(undefined);
const GameStateDispatchContext = createContext<
  Dispatch<GameStateAction> | undefined
>(undefined);

const dashboardReducer = (
  state: GameState,
  action: GameStateAction,
): GameState => {
  switch (action.type) {
    case "guess": {
      if (state.guesses >= 6) {
        return { ...state, status: "finished" };
      }
      if (state.history.includes(action.payload)) {
        return { ...state, status: "duplicate" };
      }

      return {
        ...state,
        guesses: state.guesses + 1,
        history: [...state.history, action.payload],
        status: "normal",
      };
    }
    default:
      return state;
  }
};

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
    guesses: 0,
    history: [],
    status: "normal",
  });

  return (
    <GameStateContext value={state}>
      <GameStateDispatchContext value={dispatch}>
        {children}
      </GameStateDispatchContext>
    </GameStateContext>
  );
};

export const useGameState = () => {
  const state = useContext(GameStateContext);

  if (!state) {
    throw new Error("useGameStateState must be inside GameStateProvider");
  }

  return state;
};

export const useGameStateDispatch = () => {
  const dispatch = useContext(GameStateDispatchContext);

  if (!dispatch) {
    throw new Error("useGameStateDispatch must be inside GameStateProvider");
  }

  return dispatch;
};
