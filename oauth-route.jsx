// Be would navigate to this route after success / error

import React, { useEffect } from 'react';
import LoadingPage from '../../components/LoadingPage';
import {
  OAUTH_COMPLETE_EVENT,
  OAUTH_MESSAGE_SOURCE,
} from './oauthWindow';

function paramsToObject(entries) {
  const result = {};

  for (const [key, value] of entries) {
    // each 'entry' is a [key, value] tupple
    result[key] = value;
  }

  return result;
}

export default function OAuthHandler() {
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    // end hide drawer
    const reload = searchParams.get('reload') === 'true';

    if (!window?.opener) {
      console.warn('Window.opener null');
      window.close();
      return;
    } else if (reload) {
      console.warn('Window.opener reloading');
      window.opener.location.reload();
    } else {
      console.warn('Window.opener send message');
      const params = paramsToObject(searchParams);
      window?.opener?.postMessage(
        {
          event: OAUTH_COMPLETE_EVENT,
          source: OAUTH_MESSAGE_SOURCE,
          payload: params,
        },
        '*'
      );
    }

    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);
  return (
    <LoadingPage
      description={'Please wait while we validate your account details'}
      heading={'Processing ...'}
    />
  );
}
