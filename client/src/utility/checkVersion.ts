import axios from 'axios';
import { store } from '../store/store';
import { createNotification } from '../store/action-creators';

export const checkVersion = async (isForced: boolean = false) => {
  try {
    const res = await axios.get<string>(
      'https://raw.githubusercontent.com/GeorgeSG/flame/master/client/.env'
    );

    const githubVersion = res.data
      .split('\n')
      .map((pair) => pair.split('='))[0][1];

    if (githubVersion !== process.env.REACT_APP_VERSION) {
      store.dispatch<any>(
        createNotification({
          title: 'Info',
          message: 'New version is available!',
          url: 'https://github.com/GeorgeSG/flame/blob/master/CHANGELOG.md',
        })
      );
    } else if (isForced) {
      store.dispatch<any>(
        createNotification({
          title: 'Info',
          message: 'You are using the latest version!',
        })
      );
    }
  } catch (err) {
    console.log(err);
  }
};
