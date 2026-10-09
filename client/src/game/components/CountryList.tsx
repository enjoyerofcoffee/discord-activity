import { COUNTRIES } from "@shared/countries";
import { useState } from "react";

export const CountryList = () => {
  return (
    <div className="flex flex-col h-full">
      <input
        type="text"
        placeholder="France... United Kingdom..."
        className="input w-full"
      />
      <ul className="flex flex-col bg-base-200 rounded-box w-full flex-1 p-2 overflow-auto">
        {COUNTRIES.map((country) => {
          return <li className="text-lg">{country.name}</li>;
        })}
      </ul>
    </div>
  );
};
