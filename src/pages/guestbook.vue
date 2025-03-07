<template>
  <div class="guestbook-page" :class="{ dark: isDarkTheme }">
    <!-- mobile-banner -->
    <page-banner
      v-if="isMobile"
      class="mobile-banner"
      :is-mobile="true"
      :position="70"
      :blur="false"
      :image="bannerImage"
    >
      <template #title>
        <i18n :k="LanguageKey.PAGE_GUESTBOOK" />
      </template>
      <template #description>
        <i18n :k="LanguageKey.GUESTBOOK_SLOGAN" />
      </template>
    </page-banner>
    <!-- desktop-banner -->
    <div class="desktop-banner" v-else>
      <uimage cdn class="image" :src="bannerImage" />
      <button class="like" :class="{ liked: isLiked }" :disabled="isLiked" @click="handleLike">
        <i class="icon iconfont icon-heart"></i>
        <span class="count">{{ isLiked ? `${siteLikes - 1} + 1` : siteLikes }}</span>
      </button>
      <span class="slogan">
        <span class="text">
          <i18n :k="LanguageKey.GUESTBOOK_SLOGAN" />
        </span>
      </span>
    </div>
    <div class="comment">
      <comment :post-id="0" :plain="isMobile" :fetching="mockCommentLoading" />
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue'
  import { isClient } from '/@/app/environment'
  import { useEnhancer } from '/@/app/enhancer'
  import { useUniversalFetch } from '/@/universal'
  import { useMetaStore } from '/@/stores/meta'
  import { useCommentStore } from '/@/stores/comment'
  import { useUniversalStore } from '/@/stores/universal'
  import { GAEventCategories } from '/@/constants/gtag'
  import { CommentPostType } from '/@/constants/state'
  import { Language, LanguageKey } from '/@/language'
  import { firstUpperCase } from '/@/transforms/text'
  import { META } from '/@/config/app.config'
  import PageBanner from '/@/components/common/fullpage/banner.vue'
  import Comment from '/@/components/comment/index.vue'

  export default defineComponent({
    name: 'GuestbookPage',
    components: {
      PageBanner,
      Comment
    },
    props: {
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    setup() {
      const GUESTBOOK_POST_ID = CommentPostType.Guestbook
      const { i18n, meta, gtag, globalState, isDarkTheme, isZhLang } = useEnhancer()
      const metaStore = useMetaStore()
      const commentStore = useCommentStore()
      const universalStore = useUniversalStore()
      const isLiked = computed(() => universalStore.isLikedPage(GUESTBOOK_POST_ID))
      const siteLikes = computed(() => metaStore.appOptions.data?.meta.likes || 0)
      const bannerImage = `/images/page-guestbook/banner.jpg`
      // MARK: [SSR & not first page] only
      const mockCommentLoading = ref(isClient && globalState.isHydrated.value)

      meta(() => {
        const enTitle = firstUpperCase(i18n.t(LanguageKey.PAGE_GUESTBOOK, Language.English)!)
        const titles = isZhLang.value ? [i18n.t(LanguageKey.PAGE_GUESTBOOK), enTitle] : [enTitle]
        return { pageTitle: titles.join(' | '), description: `给 ${META.author} 留言` }
      })

      const fetchAllData = () => {
        return Promise.all([
          metaStore.fetchAppOptions(true),
          commentStore.fetchList({ post_id: GUESTBOOK_POST_ID })
        ]).then(() => {
          mockCommentLoading.value = false
        })
      }

      const handleLike = async () => {
        if (isLiked.value) {
          return false
        }
        gtag?.event('like_site', {
          event_category: GAEventCategories.Universal
        })

        try {
          await metaStore.postSiteLike()
          universalStore.likePage(GUESTBOOK_POST_ID)
        } catch (error) {
          const message = i18n.t(LanguageKey.POST_ACTION_ERROR)
          console.warn(message, error)
          alert(message)
        }
      }

      useUniversalFetch(() => fetchAllData())

      return {
        LanguageKey,
        bannerImage,
        mockCommentLoading,
        isDarkTheme,
        isLiked,
        siteLikes,
        handleLike
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .guestbook-page {
    .mobile-banner {
      margin-bottom: $lg-gap;
    }

    .desktop-banner {
      position: relative;
      margin-bottom: $lg-gap;
      width: 100%;
      height: 19rem;
      border: 0;
      background-color: $module-bg;
      @include radius-box($lg-radius);

      .image {
        margin-top: -($gap * 6);
        transition: all $transition-time-slow;

        &:hover {
          transform: rotate(2deg) scale(1.1);
        }
      }

      .like {
        position: absolute;
        left: $lg-gap * 2;
        bottom: $gap * 2;
        display: inline-flex;
        align-items: center;

        &.liked,
        &:hover {
          .icon {
            color: $red;
          }
        }

        .icon {
          margin-right: $sm-gap;
          color: rgba($red, 0.6);
          font-size: $font-size-h2;
          @include color-transition();
        }

        .count {
          color: rgba($white, 0.8);
          font-weight: bold;
        }
      }

      .slogan {
        $size: 2em;
        display: block;
        position: absolute;
        right: $lg-gap * 2;
        bottom: $gap * 2;
        height: $size;
        line-height: $size;
        padding: 0 $sm-gap;
        padding-left: 3rem;
        border-top-right-radius: $mini-radius;
        border-bottom-right-radius: $mini-radius;
        opacity: 0.8;
        font-weight: 700;
        cursor: progress;
        background: linear-gradient(to left, $module-bg-lighter, $module-bg, transparent);

        .text {
          letter-spacing: 0.3px;
          font-weight: bold;
          color: $text;
          background-clip: text;
          background-image: url('/images/page-guestbook/banner.jpg');
          background-position: 100% 80%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }

    &.dark {
      .desktop-banner {
        .slogan {
          .text {
            -webkit-text-fill-color: $text !important;
          }
        }
      }
    }
  }
</style>
