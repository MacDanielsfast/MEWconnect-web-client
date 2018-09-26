import * as packageJSON from '../package.json';

const env = 'production';
const version = packageJSON.version;

const stunServers = [{ url: 'stun:global.stun.twilio.com:3478?transport=udp' }];

export { env, version, stunServers };
