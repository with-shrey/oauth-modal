export const OAUTH_MESSAGE_SOURCE = 'oauth-source-name';
export const OAUTH_COMPLETE_EVENT = 'oauth-complete';

function popupWindow(url, windowName, win, w, h) {
  const y = win.outerHeight / 2 + win.screenY - h / 2;
  const x = win.outerWidth / 2 + win.screenX - w / 2;
  return win.open(
    url,
    windowName,
    `width=${w}, height=${h}, top=${y}, left=${x}`
  );
}

export class OAuthWindow {
  popupWindow;

  listner;

  onDataHandler;

  interval;

  constructor() {
    this.popupWindow = null;
  }

  openOAuthWindow = (name, url, setLoading) => {
    setLoading('Waiting for authentication ...');
    this._startOAuthFlow(url);
  };

  _startOAuthFlow = url => {
    this.popupWindow = popupWindow(
      url,
      'OAuth Authentication - Poynt',
      window,
      800,
      700
    );

    const onClosedHandler = () => {
      // eslint-disable-next-line no-console
      console.warn('onunload');

      if (this.popupWindow?.closed) {
        this.onDataHandler({
          event: 'close',
          source: OAUTH_MESSAGE_SOURCE,
          payload: {},
        });
        clearInterval(this.interval);
        this.popupWindow = null;
      }
    };

    /**
     * Check if window is closed by user
     */
    this.interval = setInterval(() => {
      if (this.popupWindow && this.popupWindow.closed) {
        onClosedHandler();
      }
    }, 2);
  };

  focusWindow() {
    if (this.popupWindow) {
      this.popupWindow.focus();
    } else {
      this.onDataHandler({
        event: 'close',
        source: OAUTH_MESSAGE_SOURCE,
        payload: {},
      });
    }
  }

  addSingleMessageListner(onData) {
    if (this.listner) {
      this.cancelListner();
    }

    const self = this;
    // eslint-disable-next-line no-console
    console.warn('adding a new listner');
    this.onDataHandler = onData;

    this.listner = function (e) {
      // e.data hold the message from parent
      if (e && e.data && e.data.source === OAUTH_MESSAGE_SOURCE) {
        self.cancelListner();
        onData(e.data);
      }
    };

    window.addEventListener('message', this.listner, true);

    return () => {
      self.cancelListner();
    };
  }

  cancelListner() {
    // eslint-disable-next-line no-console
    console.warn('cleanup oauth listners');
    clearInterval(this.interval);
    window.removeEventListener('message', this.listner, true);
    this.onDataHandler = null;
    this.listner = null;
    this.interval = null;
    this.popupWindow = null;
  }
}
