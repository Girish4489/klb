// /components/ThemeSwitcher.tsx
'use client';
import { useTheme, Theme, themes } from './ThemeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const changeTheme = (newTheme: Theme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <>
      <div className="themeDropdown dropdown dropdown-hover">
        <span tabIndex={0} className="btn m-1">
          Theme
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </span>

        <ul
          tabIndex={0}
          className="dropdown-content z-[1] max-h-48 w-52 overflow-y-auto rounded-box bg-base-300 p-2 shadow-2xl"
        >
          <li>
            <input
              type="radio"
              name="theme-dropdown"
              className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
              aria-label="Default"
              value="default"
            />
          </li>
          {themes.map((themeOption) => (
            <li key={themeOption} value={themeOption}>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
                aria-label={themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
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
