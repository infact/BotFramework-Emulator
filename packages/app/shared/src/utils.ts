//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// Microsoft Bot Framework: http://botframework.com
//
// Bot Framework Emulator Github:
// https://github.com/Microsoft/BotFramwork-Emulator
//
// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

// We need to skip Webpack bundler on bundling 'electron':
// 1. We are using react-scripts, thus, we are not able to configure Webpack
// 2. To skip bundling, we can hack with window['require']
import { BotConfigWithPath, uniqueId } from '@bfemulator/sdk-shared';
import { IBotConfig, IEndpointService, ServiceType } from 'msbot/bin/schema';
import { NotificationType, Notification, NotificationImpl } from './types';

export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
}

export function mergeDeep(target: any, source: any): any {
  let output = Object.assign({}, target);
  // if (isObject(target) && isObject(source)) {
  {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export function deepCopySlow(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/** Tries to scan the bot record for a display string */
export const getBotDisplayName = (bot: BotConfigWithPath = newBot()): string => {
  return bot.name || bot.path || (getFirstBotEndpoint(bot) ? getFirstBotEndpoint(bot).endpoint : null) || '¯\\_(ツ)_/¯';
};

/** Creates a new bot */
export const newBot = (...bots: IBotConfig[]): IBotConfig => {
  return Object.assign(
    {},
    {
      name: '',
      description: '',
      services: []
    },
    ...bots
  );
};

/** Creates a new endpoint */
export const newEndpoint = (...endpoints: IEndpointService[]): IEndpointService => {
  return Object.assign(
    {},
    {
      type: ServiceType.Endpoint,
      name: '',
      id: uniqueId(),
      appId: '',
      appPassword: '',
      endpoint: 'http://localhost:3978/api/messages'
    },
    ...endpoints
  );
};

/** Returns the first endpoint service of a bot */
export const getFirstBotEndpoint = (bot: IBotConfig): IEndpointService => {
  if (bot.services && bot.services.length) {
    return <IEndpointService> bot.services.find(service => service.type === ServiceType.Endpoint);
  }
  return null;
};

/** Creates and returns a new notification */
export const newNotification = (title: string, message: string, type: NotificationType): Notification => {
  const notification = new NotificationImpl();
  notification.title = title;
  notification.message = message;
  notification.type = type;
  return notification;
};
