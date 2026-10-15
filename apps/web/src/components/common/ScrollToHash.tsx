import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global Scroll Handler for React Router.
 * - Automatically scrolls to anchor/hash elements (e.g. /#speakers, /#agenda) when navigating.
 * - Resets window scroll to top when navigating to pages without a hash (e.g. /speakers/:slug).
 */
export const ScrollToHash: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace(/^#/, '');

      const scrollToTarget = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try scrolling immediately
      if (!scrollToTarget()) {
        // If elements are mounting or loading asynchronously, retry with short delays
        const timeouts = [60, 180, 400, 750].map((delay) =>
          setTimeout(() => {
            scrollToTarget();
          }, delay)
        );
        return () => timeouts.forEach((t) => clearTimeout(t));
      }
    } else {
      // If navigating to a route without hash, reset scroll position to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};
