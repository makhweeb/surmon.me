<template>
  <div :id="ANCHOR.COMMENT_ELEMENT_ID" class="comment-box">
    <comment-topbar
      :total="commentStore.pagination?.total"
      :loaded="commentStore.comments.length"
      :post-id="postId"
      :fetching="fetching"
      :loading="isLoading"
      :plain="plain"
      :sort="commentState.sort"
      @sort="fetchSortComments"
    />
    <divider class="divider" size="lg" />
    <comment-publisher-main :fetching="fetching">
      <comment-publisher
        v-model:profile="guestProfile"
        :id="ANCHOR.COMMENT_PUBLISHER_ELEMENT_ID"
        :disabled="isLoading || isRootPosting"
        :total="commentStore.pagination?.total"
        :default-blossomed="plain ? true : false"
        :hidden-avatar="plain"
      >
        <template #pen>
          <comment-pen
            v-model="rootPenState.content"
            v-model:previewed="rootPenState.previewed"
            :auto-focus="plain ? false : true"
            :hidden-stationery="plain"
            :disabled="isRootPosting || isLoading"
            :posting="isRootPosting"
            @submit="handleRootSubmit"
          />
        </template>
      </comment-publisher>
    </comment-publisher-main>
    <divider class="divider" size="lg" />
    <comment-main
      :fetching="isLoading"
      :skeleton-count="plain ? 3 : 5"
      :has-data="Boolean(commentStore.commentTreeList.length)"
    >
      <template #list>
        <comment-list
          :comments="commentStore.commentTreeList"
          :reply-pid="commentState.replyPID"
          :hidden-avatar="plain"
          :hidden-ua="plain"
          :plain-vote="plain"
          @delete="handleDeleteComment"
          @reply="replyComment"
          @cancel-reply="cancelCommentReply"
        >
          <template #reply="payload">
            <comment-publisher
              v-model:profile="guestProfile"
              :id="ANCHOR.COMMENT_REPLY_PUBLISHER_ELEMENT_ID"
              :disabled="false"
              :bordered="true"
              :default-blossomed="true"
              :hidden-avatar="plain"
              :fixed-avatar="payload.isChild"
            >
              <template #pen>
                <comment-pen
                  :posting="isReplyPosting"
                  :bordered="true"
                  :auto-focus="true"
                  :hidden-stationery="plain"
                  @submit="handleReplySubmit"
                />
              </template>
            </comment-publisher>
          </template>
        </comment-list>
      </template>
      <template #pagination>
        <comment-loadmore
          :fetching="isFetching"
          :pagination="commentStore.pagination"
          :remain="commentStore.pagination?.total - commentStore.comments.length"
          @page="fetchPageComments"
        />
      </template>
    </comment-main>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    reactive,
    computed,
    watch,
    toRaw,
    onBeforeUnmount,
    onUnmounted,
    nextTick
  } from 'vue'
  import { useEnhancer } from '/@/app/enhancer'
  import { useUniversalStore, UserType } from '/@/stores/universal'
  import { useCommentStore, CommentFetchParams, Author } from '/@/stores/comment'
  import { GAEventCategories } from '/@/constants/gtag'
  import * as ANCHOR from '/@/constants/anchor'
  import { UNDEFINED } from '/@/constants/value'
  import { SortType } from '/@/constants/state'
  import { LanguageKey } from '/@/language'
  import { scrollToAnchor } from '/@/utils/scroller'
  import { luanchEmojiRain } from './helper'
  import CommentTopbar from './topbar.vue'
  import CommentMain from './list/main.vue'
  import CommentList from './list/list.vue'
  import CommentLoadmore from './loadmore.vue'
  import CommentPublisherMain from './publisher/main.vue'
  import CommentPublisher from './publisher/publisher.vue'
  import CommentPen from './publisher/pen.vue'

  export default defineComponent({
    name: 'Dsiqus',
    components: {
      CommentTopbar,
      CommentMain,
      CommentList,
      CommentLoadmore,
      CommentPublisherMain,
      CommentPublisher,
      CommentPen
    },
    props: {
      postId: {
        type: Number,
        required: true
      },
      fetching: {
        type: Boolean,
        default: false
      },
      plain: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const { i18n, gtag, globalState } = useEnhancer()
      const universalStore = useUniversalStore()
      const commentStore = useCommentStore()

      const isPosting = computed(() => commentStore.posting)
      const isFetching = computed(() => commentStore.fetching)
      const isLoading = computed(() => {
        return props.fetching || (!commentStore.comments.length && commentStore.fetching)
      })

      enum PostKey {
        Root = 'root',
        Reply = 'reply'
      }
      const postingKey = ref<PostKey>()
      const isRootPosting = computed(() => isPosting.value && postingKey.value === PostKey.Root)
      const isReplyPosting = computed(() => isPosting.value && postingKey.value === PostKey.Reply)

      const commentState = reactive({
        sort: SortType.Desc,
        replyPID: 0
      })

      const guestProfile = ref<Author>({
        name: '',
        email: '',
        site: ''
      })

      const rootPenState = reactive({
        content: '',
        previewed: false
      })

      const clearRootPenContent = () => {
        rootPenState.content = ''
      }
      const closeRootPenPreview = () => {
        rootPenState.previewed = false
      }

      const cancelCommentReply = () => {
        commentState.replyPID = 0
      }
      const replyComment = (commentID: number) => {
        commentState.replyPID = commentID
        gtag?.event('reply_comment', {
          event_category: GAEventCategories.Comment
        })
      }

      const fetchCommentList = (params: CommentFetchParams = {}) => {
        return commentStore.fetchList({
          ...params,
          sort: commentState.sort,
          post_id: props.postId
        })
      }

      const fetchSortComments = (sort: SortType) => {
        if (commentState.sort !== sort) {
          commentState.sort = sort
          fetchCommentList()
          scrollToAnchor(ANCHOR.COMMENT_ELEMENT_ID)
        }
      }

      const fetchPageComments = (page: number) => {
        const comments = commentStore.comments
        const lastCommentID = ANCHOR.getCommentItemElementID(comments[comments.length - 2].id)
        fetchCommentList({ page, loadmore: true }).then(() => {
          nextTick().then(() => {
            scrollToAnchor(lastCommentID)
          })
        })
      }

      const handleDeleteComment = (commentID: number) => {
        commentStore.deleteComment(commentID).catch((error) => {
          console.warn('delete comment failed', error)
          alert(error.message)
        })
      }

      const createComment = async (payload: { content: string; pid: number }) => {
        gtag?.event('submit_comment', {
          event_category: GAEventCategories.Comment
        })

        // content length
        if (!payload.content || !payload.content.trim()) {
          throw `${i18n.t(LanguageKey.COMMENT_POST_CONTENT)} ?`
        }
        if (payload.content.length > 3000) {
          throw `${i18n.t(LanguageKey.COMMENT_POST_ERROR_CONTENT)} ?`
        }

        // temp user profile
        const isGuest = universalStore.user.type === UserType.Null
        const guestProfileValue = guestProfile.value
        if (isGuest) {
          if (!guestProfileValue.name) {
            throw i18n.t(LanguageKey.COMMENT_POST_NAME) + '?'
          }
          if (!guestProfileValue.email) {
            throw i18n.t(LanguageKey.COMMENT_POST_EMAIL) + '?'
          }
        }

        const author: Author = isGuest
          ? toRaw(guestProfileValue)
          : universalStore.user.type === UserType.Local
          ? universalStore.user.localProfile!
          : {
              name: universalStore.user.disqusProfile.name,
              site: universalStore.user.disqusProfile.url
            }
        if (!author.email) {
          Reflect.deleteProperty(author, 'email')
        }
        if (!author.site) {
          Reflect.deleteProperty(author, 'site')
        }

        try {
          const newComment = await commentStore.postComment({
            pid: payload.pid,
            post_id: props.postId,
            content: payload.content,
            agent: globalState.userAgent.original,
            author
          })
          // set user profile
          if (isGuest) {
            universalStore.saveLocalUser({
              ...author,
              email_hash: newComment.author.email_hash
            })
          }
          // random emoji rain
          luanchEmojiRain(payload.content)
        } catch (error: any) {
          console.warn('submit comment failed:', error)
          throw error.message
        }
      }

      const validateFormByID = (formID: string) => {
        const formElement = document.getElementById(formID)! as HTMLFormElement
        const check_status = formElement.checkValidity()
        formElement.reportValidity()
        return check_status ? Promise.resolve() : Promise.reject()
      }

      const handleRootSubmit = async (content: string) => {
        await validateFormByID(ANCHOR.COMMENT_PUBLISHER_ELEMENT_ID)
        postingKey.value = PostKey.Root
        try {
          await createComment({ content, pid: 0 })
          closeRootPenPreview()
          clearRootPenContent()
        } catch (error: any) {
          alert(error)
        } finally {
          postingKey.value = UNDEFINED
        }
      }

      const handleReplySubmit = async (content: string) => {
        await validateFormByID(ANCHOR.COMMENT_REPLY_PUBLISHER_ELEMENT_ID)
        postingKey.value = PostKey.Reply
        try {
          await createComment({ content, pid: commentState.replyPID })
          cancelCommentReply()
        } catch (error: any) {
          alert(error)
        } finally {
          postingKey.value = UNDEFINED
        }
      }

      watch(isLoading, (isFetching) => {
        if (isFetching) {
          cancelCommentReply()
        }
      })

      onBeforeUnmount(() => {
        cancelCommentReply()
      })
      onUnmounted(() => {
        commentStore.clearList()
      })

      return {
        ANCHOR,
        isFetching,
        isLoading,
        isRootPosting,
        isReplyPosting,
        commentStore,
        commentState,
        rootPenState,
        guestProfile,
        replyComment,
        handleDeleteComment,
        handleRootSubmit,
        handleReplySubmit,
        cancelCommentReply,
        fetchSortComments,
        fetchPageComments
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import 'src/styles/variables.scss';
  @import 'src/styles/mixins.scss';

  .comment-box {
    padding: $gap;
    @include common-bg-module();
    @include radius-box($lg-radius);

    .divider {
      border-color: $module-bg-darker-1 !important;
    }
  }
</style>
