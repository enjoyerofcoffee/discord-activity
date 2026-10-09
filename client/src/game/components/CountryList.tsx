import {
  useFloating,
  useInteractions,
  useListNavigation,
} from "@floating-ui/react";
import { COUNTRIES } from "@shared/countries";
import { useRef, useState } from "react";

export const CountryList = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const { refs, context } = useFloating({
    open: true,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: (v) => setActiveIndex(v || 0),
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNavigation],
  );

  const counries = COUNTRIES.map((country) => country.name);

  return (
    <div className="flex flex-col h-full">
      <input
        ref={refs.setReference}
        {...getReferenceProps()}
        type="text"
        placeholder="France... United Kingdom..."
        className="input w-full"
      />
      <div
        ref={refs.setFloating}
        {...getFloatingProps()}
        className="flex flex-col bg-base-200 rounded-box w-full flex-1 p-2 overflow-auto"
      >
        {counries.map((country, index) => {
          return (
            <div
              key={`${country}-${index}`}
              className="text-lg"
              tabIndex={activeIndex === index ? 0 : -1}
              ref={(node) => {
                listRef.current[index] = node;
              }}
              {...getItemProps()}
            >
              {country}
            </div>
          );
        })}
      </div>
    </div>
  );
};
