import { ServerConfig } from '../models/server-config.model';

export let serverConfig: ServerConfig;
export const initServerConfig = (config: ServerConfig) => serverConfig = config;
