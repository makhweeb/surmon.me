/**
 * @file Avatar
 * @author Surmon <https://github.com/surmon-china>
 */

import API_CONFIG from '/@/config/api.config'
import { ProxyModule } from '/@/constants/proxy'
import { getTargetCDNURL, getTargetProxyURL } from '/@/transforms/url'
import { isSPA } from '/@/app/environment'
import { isDev } from '/@/environment'

export const getDefaultAvatar = () => {
  return getTargetCDNURL('/images/gravatar.png')
}

export const getGravatarByHash = (hash?: string | null) => {
  if (!hash) {
    return getDefaultAvatar()
  }

  if (isDev) {
    return `https://www.gravatar.com/avatar/${hash}`
  }

  return `${API_CONFIG.STATIC}/avatar/${hash}`
}

export const getDisqusAvatarByUsername = (username: string) => {
  // https://disqus.com/api/docs/images/
  const target = `https://disqus.com/api/users/avatars/${username}.jpg`
  return isSPA ? target : getTargetProxyURL(target, ProxyModule.Disqus)
}
