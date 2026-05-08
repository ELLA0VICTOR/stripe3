import { useState } from "react";
import { Button } from "../ui";

const storageKey = "stripe3-cookie-consent";

const defaultChoices = {
  essential: true,
  preferences: false,
  analytics: false,
};

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !window.localStorage.getItem(storageKey));
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState(defaultChoices);

  function saveConsent(nextChoices) {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...nextChoices,
        savedAt: new Date().toISOString(),
      }),
    );
    setChoices(nextChoices);
    setVisible(false);
  }

  function toggleChoice(key) {
    setChoices((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  if (!visible) return null;

  return (
    <section className="cookie-consent" aria-label="Cookie consent">
      <div>
        <div className="cookie-title">Cookies on stripe3</div>
        <p className="cookie-copy">
          We use essential storage to keep wallet/session preferences working. You can also allow preference and analytics categories to help us improve the product.
        </p>

        {customizing && (
          <div className="cookie-options">
            <label>
              <input type="checkbox" checked readOnly />
              <span>Essential</span>
              <small>Required for wallet and interface state.</small>
            </label>
            <label>
              <input
                type="checkbox"
                checked={choices.preferences}
                onChange={() => toggleChoice("preferences")}
              />
              <span>Preferences</span>
              <small>Remember display and product choices.</small>
            </label>
            <label>
              <input
                type="checkbox"
                checked={choices.analytics}
                onChange={() => toggleChoice("analytics")}
              />
              <span>Analytics</span>
              <small>Understand usage without payment data.</small>
            </label>
          </div>
        )}
      </div>

      <div className="cookie-actions">
        <Button variant="ghost" onClick={() => setCustomizing((current) => !current)}>
          {customizing ? "Hide options" : "Customize"}
        </Button>
        <Button variant="secondary" onClick={() => saveConsent(defaultChoices)}>
          Reject non-essential
        </Button>
        <Button onClick={() => saveConsent({ essential: true, preferences: true, analytics: true })}>
          Accept all
        </Button>
        {customizing && (
          <Button variant="secondary" onClick={() => saveConsent(choices)}>
            Save choices
          </Button>
        )}
      </div>
    </section>
  );
}
