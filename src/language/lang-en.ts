import type { LanguageMap } from '.'
import { LanguageKey } from './key'
import { META } from '/@/config/app.config'

export const enLangMap: LanguageMap = {
  [LanguageKey.APP_SLOGAN]: META.en_sub_title,
  [LanguageKey.CATEGORY_INSIGHT]: 'Insight',
  [LanguageKey.CATEGORY_CODE]: 'Code',
  [LanguageKey.PAGE_HOME]: 'Home',
  [LanguageKey.PAGE_GITHUB]: 'GitHub',
  [LanguageKey.PAGE_ARCHIVE]: 'Archive',
  [LanguageKey.PAGE_ABOUT]: 'About',
  [LanguageKey.PAGE_GUESTBOOK]: 'Guestbook',
  [LanguageKey.PAGE_APP]: 'APP',
  [LanguageKey.PAGE_LENS]: 'Lens',
  [LanguageKey.PAGE_JOB]: 'Job',
  [LanguageKey.PAGE_MERCH]: 'Merch',
  [LanguageKey.PAGE_SPONSOR]: 'Sponsor',
  [LanguageKey.PAGE_FREELANCER]: 'Freelancer',
  [LanguageKey.EMPTY_PLACEHOLDER]: 'No data',
  [LanguageKey.NOT_FOUND]: 'Arrives here at last',
  [LanguageKey.BACK_TO_HOME_PAGE]: 'Drive by',
  [LanguageKey.GUESTBOOK_SLOGAN]: 'You have come a long way',
  [LanguageKey.PAGE_FREELANCER_SLOGAN]: 'Talk is cheap. Show me the code',
  [LanguageKey.PAGE_FREELANCER_EMAIL_ME]: 'Email me',
  [LanguageKey.SPONSOR_TEXT]:
    'Both monthly-recurring sponsorships and one-time donations are accepted',
  [LanguageKey.AD]: 'AD',
  [LanguageKey.BARRAGE]: 'Barrage',
  [LanguageKey.FEEDBACK]: 'Feedback',
  [LanguageKey.TO_TOP]: 'To top',
  [LanguageKey.TO_BOTTOM]: 'Next screen',
  [LanguageKey.ORIGIN_ORIGINAL]: 'OG',
  [LanguageKey.ORIGIN_REPRINT]: 'RPT',
  [LanguageKey.ORIGIN_HYBRID]: 'HY',
  [LanguageKey.ACTION_ON]: 'on',
  [LanguageKey.ACTION_OFF]: 'off',
  [LanguageKey.MUSIC_PLACEHOLDER]: 'The music, the soul of man',
  [LanguageKey.SEARCH_PLACEHOLDER]: 'Search...',
  [LanguageKey.ANNOUNCEMENT_PLACEHOLDER]: 'No announcements',
  [LanguageKey.CATEGORY_PLACEHOLDER]: 'no cate',
  [LanguageKey.TAG_PLACEHOLDER]: 'No tags',
  [LanguageKey.ARTICLE_TITLE]: 'Articles',
  [LanguageKey.ARTICLE_VIEWS]: 'views',
  [LanguageKey.ARTICLE_PLACEHOLDER]: 'No articles',
  [LanguageKey.ARTICLE_READ_ALL]: 'Render all',
  [LanguageKey.ARTICLE_RENDERING]: 'Rendering...',
  [LanguageKey.HOT_ARTICLE_LIST_TITLE]: 'Hottest',
  [LanguageKey.ARTICLE_LIST_LOADMORE]: 'Loadmore',
  [LanguageKey.ARTICLE_LIST_LOADING]: 'Loading',
  [LanguageKey.ARTICLE_LIST_NO_MORE]: 'No more',
  [LanguageKey.COMMENT_LIST_EMPTY]: 'Be the first to comment',
  [LanguageKey.COMMENT_UPVOTE]: 'upvote',
  [LanguageKey.COMMENT_DOWNVOTE]: 'downvote',
  [LanguageKey.COMMENT_DELETE]: 'delete',
  [LanguageKey.COMMENT_DELETE_CONFIRM]:
    'Are you sure you want to delete this comment? You cannot undo this action.',
  [LanguageKey.COMMENT_REPLY]: 'reply',
  [LanguageKey.COMMENT_REPLY_CANCEL]: 'cancel reply',
  [LanguageKey.COMMENT_MODERATOR]: 'Moderator',
  [LanguageKey.COMMENT_SORT_OLD]: 'Oldest',
  [LanguageKey.COMMENT_SORT_NEW]: 'Newest',
  [LanguageKey.COMMENT_SORT_HOT]: 'Hottest',
  [LanguageKey.COMMENT_POST_NAME]: 'name',
  [LanguageKey.COMMENT_POST_EMAIL]: 'email',
  [LanguageKey.COMMENT_POST_SITE]: 'site',
  [LanguageKey.COMMENT_POST_CONTENT]: 'content',
  [LanguageKey.COMMENT_POST_PLACEHOLDER]: 'Hit the nail on the head',
  [LanguageKey.COMMENT_POST_ERROR_CONTENT]: 'Content requirements are within 3000 words!',
  [LanguageKey.QUERY_PARAMS_ERROR]: 'Invalid query params: ',
  [LanguageKey.POST_ACTION_ERROR]: 'Failed! Get error detail in console',
  [LanguageKey.SUBMIT]: 'Submit',
  [LanguageKey.SUBMITTING]: 'Submitting...',
  [LanguageKey.MOMENT_AM]: 'AM',
  [LanguageKey.MOMENT_PM]: 'PM',
  [LanguageKey.MOMENT_JUST_NOW]: 'Just now',
  [LanguageKey.MOMENT_MINUTES]: 'minutes',
  [LanguageKey.MOMENT_HOURS]: 'hours',
  [LanguageKey.MOMENT_WEEKS]: 'weeks',
  [LanguageKey.MOMENT_DAYS]: 'days',
  [LanguageKey.MOMENT_MONTHS]: 'months',
  [LanguageKey.MOMENT_YEAR]: 'year',
  [LanguageKey.MOMENT_AGO]: (args: { date: string }) => `${args.date} ago`
}
