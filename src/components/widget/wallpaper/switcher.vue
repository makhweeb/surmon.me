<template>
  <div id="wallpaper">
    <div class="switcher" :class="{ dark: isDarkTheme }" @click="handleOpenWallpaper">
      <div class="title">
        <i class="iconfont icon-bing" />
        <span class="text">BING</span>
      </div>
    </div>
  </div>
  <client-only>
    <popup v-model:visible="isOnWallpaper" :mask-close="false" :scroll-close="false">
      <wallpapers @close="handleCloseWallpaper" />
    </popup>
  </client-only>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { useWallpaperStore } from '/@/stores/wallpaper'
  import { GAEventCategories } from '/@/constants/gtag'
  import { Language } from '/@/language'
  import Wallpapers from './wall.vue'

  export default defineComponent({
    name: 'Wallpaper',
    components: {
      Wallpapers
    },
    setup() {
      const { i18n, gtag, isDarkTheme } = useEnhancer()
      const wallpaperStore = useWallpaperStore()
      const wallpapers = computed(() => wallpaperStore.papers(i18n.language.value as Language))
      const isOnWallpaper = ref(false)
      const handleCloseWallpaper = () => {
        isOnWallpaper.value = false
      }

      const handleOpenWallpaper = () => {
        gtag?.event('wallpaper_modal', {
          event_category: GAEventCategories.Widget
        })

        if (wallpapers.value?.length) {
          isOnWallpaper.value = true
        } else {
          alert('Something went wrong！')
        }
      }

      return {
        isDarkTheme,
        isOnWallpaper,
        handleOpenWallpaper,
        handleCloseWallpaper
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  #wallpaper {
    $width: 2rem;
    $height: 6.6rem;
    position: fixed;
    top: 18%;
    right: 0;
    cursor: pointer;

    .switcher {
      position: relative;
      width: $width;
      height: $height;
      display: block;
      border-style: solid;
      border-color: $bing-primary;
      border-top-width: 4px;
      border-top-left-radius: $xs-radius;
      border-bottom-left-radius: $xs-radius;
      opacity: 0.5;
      transition: opacity $transition-time-fast;
      background-color: #ffffff;
      &.dark {
        background-color: #ececec;
      }
      &:hover {
        opacity: 0.8;
      }

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        font-family: 'webfont-bolder', DINRegular;
        writing-mode: tb-rl;
        color: $bing-primary;
        font-size: $font-size-small - 1;
        letter-spacing: 2px;
        text-align: center;
        transition: width $transition-time-fast;

        .iconfont {
          font-size: 16px;
          margin-bottom: $xs-gap;
        }

        .text {
          font-weight: bold;
        }
      }
    }
  }
</style>
