<template>
  <header :id="HEADER_ELEMENT_ID" class="header" :class="{ 'enable-nav': isEnabledNav }">
    <div class="header-container container">
      <div class="header-header">
        <uimage cdn src="/images/logo.svg" class="header-logo" />
        <span class="header-slogan">
          <i18n :k="LanguageKey.APP_SLOGAN" />
        </span>
        <router-link
          to="/"
          class="header-link"
          :title="t(LanguageKey.APP_SLOGAN)"
          @mousedown="handleRootNavEvent"
        />
      </div>
      <div class="toolbox">
        <button class="button menu" v-if="isEnabledNav">
          <i class="iconfont icon-top-menu"></i>
        </button>
        <button
          class="button language"
          title="Switch language"
          :class="language"
          @click="tooggleLanguage"
        >
          {{ language || '-' }}
        </button>
        <button class="button theme" :class="theme" @click="toggleTheme">
          <i class="iconfont" :class="themeIcon"></i>
        </button>
      </div>
    </div>
    <div class="header-nav">
      <nav class="nav-list container">
        <template v-for="(menu, index) in menus" :key="menu.id">
          <span class="divider" v-if="index > 0"></span>
          <router-link
            v-if="menu.route"
            class="item"
            :class="[menu.id, { hot: menu.hot }]"
            :to="menu.route"
            exact
          >
            <uimage v-if="menu.imageIcon" class="image-icon" :src="menu.imageIcon" />
            <i v-else class="iconfont" :class="menu.icon"></i>
            <span class="text">
              <i18n :k="menu.i18nKey" />
            </span>
            <span v-if="menu.hot" class="superscript">
              <i class="iconfont icon-hot-fill"></i>
            </span>
          </router-link>
          <ulink
            v-else-if="menu.url"
            class="item"
            :class="[menu.id, { hot: menu.hot }]"
            :href="menu.url"
          >
            <i class="iconfont" :class="menu.icon"></i>
            <span class="text">
              <i18n :k="menu.i18nKey" />
            </span>
            <span class="newscript" v-if="menu.newWindow">
              <i class="iconfont icon-new-window-s"></i>
            </span>
            <span class="superscript" v-if="menu.hot">
              <i class="iconfont icon-hot-fill"></i>
            </span>
          </ulink>
        </template>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { LanguageKey } from '/@/language'
  import { Theme } from '/@/composables/theme'
  import { HEADER_ELEMENT_ID } from '/@/constants/anchor'
  import { GAEventCategories } from '/@/constants/gtag'
  import { menus } from './menu'

  export default defineComponent({
    name: 'DesktopHeader',
    setup() {
      const { i18n, gtag, theme, globalState } = useEnhancer()
      // 非常规布局则启用菜单
      const isEnabledNav = computed(() => !globalState.layoutColumn.value.isNormal)

      const themeValue = theme.theme
      const themeIcon = computed(() => {
        const themeIconMap = {
          [Theme.Light]: 'icon-sun',
          [Theme.Dark]: 'icon-moon'
        }
        return themeIconMap[themeValue.value]
      })

      const toggleTheme = () => {
        theme.toggle()
        gtag?.event('switch_theme', {
          event_category: GAEventCategories.Widget,
          event_label: theme.theme.value
        })
      }

      const tooggleLanguage = () => {
        i18n.toggle()
        gtag?.event('switch_language', {
          event_category: GAEventCategories.Widget,
          event_label: i18n.l.value?.name
        })
      }

      const handleRootNavEvent = () => {
        gtag?.event('root_header_home_nav', {
          event_category: GAEventCategories.Universal
        })
      }

      return {
        menus,
        HEADER_ELEMENT_ID,
        LanguageKey,
        isEnabledNav,
        handleRootNavEvent,
        t: i18n.t,
        language: i18n.language,
        tooggleLanguage,
        theme: themeValue,
        themeIcon,
        toggleTheme
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $header-height;
    z-index: $z-index-header;
    background-color: $module-bg;
    border-bottom: 1px solid $module-bg-darker-2;
    @include backdrop-blur(5px);

    &.enable-nav:hover {
      .header-nav {
        @include visible();
      }
    }

    .header-container {
      height: 100%;
      display: flex;
      justify-content: space-between;

      .header-header {
        height: 100%;
        display: flex;
        position: relative;
        align-items: center;
        padding-left: $sm-gap;
        width: 29em;
        overflow: hidden;

        @keyframes logo-blink {
          0% {
            mask-position: -30%;
          }
          100% {
            mask-position: 666%;
          }
        }

        .header-logo {
          width: 11rem;
          margin-right: $gap * 4;
          filter: $theme-logo-rotate;
          .logo-st {
            fill: $primary;
          }
        }

        .header-slogan {
          color: $primary;
          font-size: $font-size-h5;
          font-family: 'webfont-medium', DINRegular;
        }

        .header-link {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }

      .toolbox {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        @include visibility-transition();
        &:hover {
          opacity: 1;
        }

        .button {
          position: relative;
          display: block;
          text-transform: uppercase;
          margin: 0 $gap;
          width: 2rem;
          height: 2rem;

          &::before {
            content: '';
            display: block;
            width: 50%;
            height: 2px;
            position: absolute;
            left: 25%;
            bottom: -2px;
          }

          &.menu {
            cursor: none;
            &::before {
              background-color: $black;
            }
          }

          &.theme {
            &::before {
              background-color: $primary;
            }
          }

          &.language {
            font-weight: bold;

            &.en {
              &::before {
                background-color: $en-primary;
              }
            }
            &.zh {
              &::before {
                background-color: $zh-primary;
              }
            }
          }
        }
      }
    }

    .header-nav {
      width: 100%;
      height: 4rem;
      background-color: $primary-lighter;
      @include hidden();
      @include visibility-transition();

      .nav-list {
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        align-items: center;

        .divider {
          height: 6px;
          width: 1px;
          background-color: $module-bg-translucent;
        }

        .item {
          text-transform: uppercase;
          color: $text-reversal;
          @include visibility-transition();
          opacity: 0.7;
          &:hover {
            opacity: 1;
          }

          &.link-active {
            .text {
              padding-bottom: 4px;
              border-bottom: 2px solid;
            }
          }

          .image-icon {
            width: 1em;
            height: 1em;
            margin-right: $sm-gap;
            border-radius: $xs-radius;
          }

          > .iconfont {
            margin-right: $sm-gap;
          }

          .newscript,
          .superscript {
            margin-left: $xs-gap;
          }
        }
      }
    }
  }
</style>
