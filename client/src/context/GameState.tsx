import { createContext, useContext, useReducer, type Dispatch } from "react";

export const MAX_TRIES = 5;

type Status = "normal" | "duplicate" | "error" | "finished";
export type History = {
  countryCode: string;
  percentage: number;
};

type GameState = {
  guesses: number;
  history: History[];
  status: Status;
};

type GameStateAction = { type: "guess"; payload: History };

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
      if (state.guesses >= MAX_TRIES) {
        return { ...state, status: "finished" };
      }
      if (
        state.history.some(
          (item) => item.countryCode === action.payload.countryCode,
        )
      ) {
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
