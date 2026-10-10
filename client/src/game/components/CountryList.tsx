import {
  useFloating,
  useFocus,
  useInteractions,
  useListNavigation,
  useRole,
} from "@floating-ui/react";
import { COUNTRIES } from "@shared/countries";
import { useMemo, useRef, useState } from "react";
import { useGameState, useGameStateDispatch } from "../../context/GameState";

export const CountryList = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useGameStateDispatch();
  const { status } = useGameState();
  const finished = status === "finished_won" || status === "finished_loss";

  const COUNTRY_NAMES = COUNTRIES.map((country) => country.name);

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => setIsOpen(open && !!search.length),
  });

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    loop: true,
    virtual: true,
    onNavigate: setActiveIndex,
  });

  const focus = useFocus(context);
  const role = useRole(context, { role: "listbox" });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNavigation, focus, role],
  );

  const countries = useMemo(() => {
    const query = search.toLocaleLowerCase();

    return COUNTRY_NAMES.filter((country) =>
      country.toLocaleLowerCase().includes(query),
    );
  }, [search]);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    const value = e.currentTarget.value;

    setSearch(value);
    setActiveIndex(null);
    setIsOpen(value !== "");
  };

  const selected = countries.find(
    (country) => country.toLocaleLowerCase() === search.toLocaleLowerCase(),
  );

  const handleSelect = (index: number) => {
    setSearch(countries[index]);
    setActiveIndex(null);
    setIsOpen(false);
  };

  const handleSubmit = () => {
    if (finished || !selected) {
      return;
    }

    const countryName = selected.toLocaleLowerCase();
    const countryToSubmit = COUNTRIES.find(
      (country) => country.name.toLowerCase() === countryName,
    );

    if (!countryToSubmit) {
      return;
    }

    setSearch("");
    setActiveIndex(null);
    setIsOpen(false);
    dispatch({
      type: "guess",
      payload: { countryCode: countryToSubmit.code, percentage: 0 },
    });
  };

  return (
    <div
      className={`relative flex flex-col flex-1 shrink-0 ${status === "finished_won" && "aura aura-glow"}`}
    >
      <div
        className={`flex h-10 rounded-sm border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-black/20 ${
          status === "duplicate"
            ? "border-amber-400"
            : status === "finished_won"
              ? "border-emerald-600"
              : "border-black"
        }`}
      >
        <input
          value={search}
          ref={refs.setReference}
          type="text"
          placeholder="France... United Kingdom..."
          disabled={finished}
          className="flex-1 min-w-0 px-3 bg-transparent outline-none disabled:cursor-not-allowed"
          {...getReferenceProps({
            onChange: handleSearchChange,
            onKeyDown(event) {
              if (event.key === "Enter") {
                event.preventDefault();

                if (
                  isOpen &&
                  activeIndex !== null &&
                  countries[activeIndex] &&
                  countries[activeIndex] !== selected
                ) {
                  handleSelect(activeIndex);
                  return;
                }

                handleSubmit();
              }
            },
          })}
        />
        <button
          type="button"
          className="px-4 bg-black text-white text-sm font-bold uppercase cursor-pointer disabled:opacity-40 disabled:cursor-default"
          disabled={finished || !selected}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleSubmit}
        >
          Guess
        </button>
      </div>
      {status === "duplicate" && (
        <label className="label mt-2" htmlFor="name">
          You have already guessed this country!
        </label>
      )}
      {isOpen && (
        <div
          ref={refs.setFloating}
          className="absolute top-12 w-full bg-white border border-black rounded-sm flex-1 overflow-auto z-100"
          {...getFloatingProps({
            onMouseDown: (event) => event.preventDefault(),
          })}
        >
          {countries.map((country, index) => (
            <div
              key={`${country}-${index}`}
              className={`hover:bg-gray-200 p-2 ${activeIndex === index && "bg-gray-200"}`}
              ref={(node) => {
                listRef.current[index] = node;
              }}
              {...getItemProps({
                onClick: () => handleSelect(index),
              })}
            >
              {country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
