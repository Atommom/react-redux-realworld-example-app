import { v4 as uuidv4 } from 'uuid';
import { getBrowser, getOS } from './util';

class Tracker {
  init({ api_host: apiHost, interval }) {
    this._apiHost = apiHost;
    this._interval = interval || 60000; // 1 min by default
    this.events = [];

    if (!this._apiHost) {
      throw new Error('Tracker API Host does not exist!');
    }

    this._createDevice();
    this._startTimer();
  }

  _createDevice() {
    const deviceIdKey = 'tracker_device_id';
    let deviceId = localStorage.getItem(deviceIdKey);
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(deviceIdKey, deviceId);
    }

    this.deviceId = deviceId;
  }

  _getToken() {
    return localStorage.getItem('jwt');
  }

  _startTimer() {
    setInterval(() => {
      this._sendEvents();
    }, this._interval);
  }

  async _sendEvents() {
    if (this.events.length > 0) {
      try {
        await fetch(this._apiHost, {
          method: 'POST',
          body: btoa(JSON.stringify(this.events))
        });
        this.events = [];
      } catch (e) {
        console.error(e);
      }
    }
  }

  identify(id) {
    this.userId = id;
  }

  track(event, options = {}) {
    const [browser, version] = getBrowser().split(' ');

    this.events.push({
      event,
      properties: {
        token: this._getToken(),
        $browser: browser,
        $browser_version: version,
        $current_url: window.location.href,
        $device_id: this.deviceId,
        $os: getOS(),
        $screen_width: window.innerWidth,
        $screen_height: window.innerHeight,
        ...options
      }
    });
  }
}

export default Tracker;
