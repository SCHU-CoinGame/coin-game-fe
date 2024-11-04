import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UsePreventNavigationProps {
  when: boolean;
  message?: string;
}

const usePreventNavigation = ({
  when,
  message = '페이지를 떠나시겠습니까?',
}: UsePreventNavigationProps) => {
  const navigate = useNavigate();

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (when) {
        event.preventDefault();
        event.returnValue = message;

        sessionStorage.setItem('shouldRedirect', 'true');
        return message;
      }
    },
    [when, message],
  );

  const blockBackNavigation = useCallback(() => {
    window.history.pushState(null, '', window.location.href);
  }, []);

  useEffect(() => {
    const shouldRedirect = sessionStorage.getItem('shouldRedirect');
    if (shouldRedirect) {
      sessionStorage.removeItem('shouldRedirect');
      navigate('/signin');
    }

    if (when) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', blockBackNavigation);
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, [when, handleBeforeUnload, blockBackNavigation, navigate]);
};

export { usePreventNavigation };
