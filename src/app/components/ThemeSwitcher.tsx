// /components/ThemeSwitcher.tsx
"use client";
import { trace } from "console";
import { useTheme, Theme } from "./ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const changeTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };

  const themes: Theme[] = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  return (
    <>
      <style jsx>
        {`
          .customScroll {
            scrrollbar-margin-y: 10px;
          }
          .customScroll::-webkit-scrollbar {
            width: 8px;
          }
          .customScroll::-webkit-scrollbar-track {
            width: 8px;
            margin: 10px 0;
            padding-right: 10px;
          }
          .customScroll::-webkit-scrollbar-track:hover {
            width: 18px;
          }
          .customScroll::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
            width: 8px;
          }
          .customScroll::-webkit-scrollbar-thumb:hover {
            background: #555;
            width: 18px;
          }
          .themeDropdown:hover svg {
            transform: rotate(180deg);
          }
        `}
      </style>
      <div className="dropdown dropdown-hover themeDropdown">
        <span tabIndex={0} className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="h-2 w-2 fill-current opacity-60 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </span>

        <ul
          tabIndex={0}
          className="customScroll dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            scrollbarWidth: "thin",
          }}
        >
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
              aria-label="Default"
              value="default"
            />
          </li>
          {themes.map((themeOption) => (
            <li key={themeOption} value={themeOption}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label={
                  themeOption.charAt(0).toUpperCase() + themeOption.slice(1)
                }
                onChange={(e) => changeTheme(e.target.value as Theme)}
                value={themeOption}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
