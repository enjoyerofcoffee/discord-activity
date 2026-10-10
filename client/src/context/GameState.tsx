import type { Country } from "@shared/types";
import { createContext, useContext, useReducer, type Dispatch } from "react";
import { getDailyCountry } from "../daily";

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
};

type GameState = {
  guesses: number;
  daily: Country;
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

export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, {
    guesses: 0,
    daily: getDailyCountry(),
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
