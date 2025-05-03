import { useEffect } from "react";

interface HotkeyConfig {
  keys: string[];
  callback: (event: KeyboardEvent) => void;
  description?: string;
}

const isMac =
  typeof window !== "undefined" && navigator.platform.includes("Mac");

const modifierMap = {
  mod: isMac ? "metaKey" : "ctrlKey",
  ctrl: "ctrlKey",
  shift: "shiftKey",
  alt: "altKey",
  meta: "metaKey",
};

const keyMap: { [key: string]: number } = {
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  f11: 122,
};

const parseKeys = (keys: string) => {
  const parts = keys
    .toLowerCase()
    .split("+")
    .map((part) => part.trim());
  const modifiers = parts.filter((part) => part in modifierMap);
  const key = parts.find((part) => !(part in modifierMap)) || "";

  return {
    key,
    modifiers: modifiers.map(
      (mod) => modifierMap[mod as keyof typeof modifierMap]
    ),
  };
};

const useHotkeys = (hotkeys: HotkeyConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      hotkeys.forEach(({ keys, callback }) => {
        keys.forEach((keyCombo) => {
          const { key, modifiers } = parseKeys(keyCombo);

          const keyMatches =
            key in keyMap
              ? event.keyCode === keyMap[key]
              : event.key.toLowerCase() === key;

          const modifiersMatch = modifiers.every(
            (modifier) => event[modifier as keyof KeyboardEvent]
          );

          if (keyMatches && modifiersMatch) {
            callback(event);
          }
        });
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkeys]);
};

export default useHotkeys;
