import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useBackButton = (shouldConfirm: boolean) => {
  const navigate = useNavigate();
  const pushedRef = useRef(false);

  useEffect(() => {
    // Push a state to "trap" the back button
    // We use a specific state object to identify our trap if needed, though mostly just having *a* state is enough.
    if (!pushedRef.current) {
      window.history.pushState({ trapped: true }, "", window.location.pathname);
      pushedRef.current = true;
    }

    const handlePopState = () => {
      // The user clicked back.
      if (shouldConfirm) {
        const confirmed = window.confirm(
          "Are you sure you want to leave? Your progress will be lost."
        );
        if (confirmed) {
          navigate("/", { replace: true });
        } else {
          // User cancelled. We need to restore the "trapped" state so they can click back again.
          window.history.pushState(
            { trapped: true },
            "",
            window.location.pathname
          );
        }
      } else {
        // No confirmation needed (Download page)
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldConfirm, navigate]);
};
