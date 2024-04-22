import { OAuthWindow } from './oauthWindow';

const oauthWindow = new OAuthWindow();

function Button() {
    const [loading, setLoading] = useState(false)

  useEffect(() => {
    return oauthWindow.addSingleMessageListner(async oauthWindowData => {
      setLoading('');

      if (oauthWindowData.payload.success === 'true') {
        // Do on success
        return;
      }
      // Error fallback
      setLoading('');
      setOauthError(
        'Something went wrong while authenticating account, make sure you have enabled popups and refresh to try again'
      );
      return;
    });
  }, []);

  return <button onClick={() => {
    oauthWindow.openOAuthWindow(
        'OAuth Window Name',
        'https://host.com/oauth-url',
        setLoading
      );
  }} ></button>
}