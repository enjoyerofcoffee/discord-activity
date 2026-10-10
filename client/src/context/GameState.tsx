import type { Country } from "@shared/types";
import { getDailySeed } from "@shared/daily";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { getDailyCountry } from "../daily";
import { loadHistory, saveHistory } from "../save";

export const MAX_TRIES = 5;

type Status =
  | "normal"
  | "duplicate"
  | "error"
  | "finished_loss"
  | "finished_won";
export type History = {
  countryCode: string;
  percentage: number;
  arrow: number | null; // bearing in degrees from guess to answer, null when correct
};

type GameState = {
  guesses: number;
  daily: Country;
  history: History[];
  status: Status;
};

type GameStateAction =
  | { type: "guess"; payload: History }
  | { type: "load"; payload: History[] };

const GameStateContext = createContext<GameState | undefined>(undefined);
const GameStateDispatchContext = createContext<
  Dispatch<GameStateAction> | undefined
>(undefined);

const dashboardReducer = (
  state: GameState,
  action: GameStateAction,
): GameState => {
  switch (action.type) {
    case "load": {
      // Rebuild the game from the guesses saved on the server
      const history = action.payload;
      const won = history.some((item) => item.countryCode === state.daily.code);
      const guesses = won ? history.length - 1 : history.length;

      return {
        ...state,
        guesses: guesses,
        history: history,
        status: won
          ? "finished_won"
          : guesses >= MAX_TRIES
            ? "finished_loss"
            : "normal",
      };
    }
    case "guess": {
      if (state.status === "finished_won" || state.status === "finished_loss") {
        return state;
      }

      if (action.payload.countryCode === state.daily.code) {
        const history = state.history.some(
          (country) => country.countryCode === state.daily.code,
        )
          ? [...state.history]
          : [...state.history, action.payload];

        return {
          ...state,
          history: history,
          status: "finished_won",
        };
      }

      if (
        state.history.some(
          (item) => item.countryCode === action.payload.countryCode,
        )
      ) {
        return { ...state, status: "duplicate" };
      }

      if (action.payload.countryCode === state.daily.code) {
        return {
          ...state,
          history: [...state.history, action.payload],
          status: "finished_won",
        };
      }

      return {
        ...state,
        guesses: state.guesses + 1,
        history: [...state.history, action.payload],
        status: state.guesses + 1 >= MAX_TRIES ? "finished_loss" : "normal",
      };
    }
    default:
      return state;
  }
};

export const GameStateProvider = ({ children }: { children: ReactNode }) => {
  // Kept for the whole session, so guesses made after midnight still save to the game they belong to
  const [seed] = useState(getDailySeed);
  const [state, dispatch] = useReducer(dashboardReducer, {
    guesses: 0,
    daily: getDailyCountry(seed),
    history: [],
    status: "normal",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadHistory(seed).then((history) => {
      dispatch({ type: "load", payload: history });
      setLoaded(true);
    });
  }, [seed]);

  useEffect(() => {
    if (loaded) saveHistory(seed, state.history);
  }, [loaded, seed, state.history]);

  if (!loaded) return null;

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
