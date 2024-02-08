export const mockedData = [
  {
    id: 'dapplets.near/CatsAreEverywhere',
    description: 'CatsAreEverywhere',
    overrides: {
      'mob.near/widget/Image': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/TestMutation1',
    description: 'TestMutation1',
    overrides: {
      'mob.near/widget/N.NotPremiumCompose': 'dapplets.near/widget/Cat',
      'mob.near/widget/Image': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.SocialMarkdown': 'dapplets.near/widget/Cat',
      'mob.near/widget/TimeAgo': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/TestMutation2',
    description: 'TestMutation2',
    overrides: {
      'mob.near/widget/MainPage.N.Post.Header': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/TestMutation3',
    description: 'TestMutation3',
    overrides: {},
  },
  {
    id: 'dapplets.near/TestMutation4',
    description: 'TestMutation4',
    overrides: {
      'mob.near/widget/N.LikeButton': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/CatsInsteadOfPosts',
    description: 'CatsInsteadOfPosts',
    overrides: {
      'mob.near/widget/MainPage.N.Post.Content': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.CommentButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.RepostButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.LikeButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/MainPage.N.Post.ShareButton': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/CatsAndDislike',
    description: 'CatsAndDislike',
    overrides: {
      'mob.near/widget/N.CommentButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.RepostButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.LikeButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/MainPage.N.Post.ShareButton': 'dapplets.near/widget/Cat',
    },
  },
  {
    id: 'dapplets.near/Likes and Dislikes',
    description: 'Likes and Dislikes',
    overrides: {
      'mob.near/widget/N.LikeButton': 'dapplets.near/widget/N.DislikeButton',
    },
  },
  {
    id: 'alsakhaev.near/red-buttons',
    description: 'I like red buttons',
    overrides: {
      'paywall.near/widget/PaywallDapplet-Button': 'alsakhaev.near/widget/TheRedButton',
    },
  },
  {
    id: 'dapplets.sputnik-dao.near/community',
    description: 'Community-driven Web',
    overrides: {},
  },
  {
    id: 'mybadge.near/NEAR Community Tools',
    description: 'NEAR Community Tools',
    overrides: {
      'mob.near/widget/MainPage.N.Post.Header': 'mybadge.near/widget/Near.VeteranBadge',
      'mob.near/widget/FollowStats': 'mybadge.near/widget/Near.BossFullBadge',
    },
  },
  {
    id: 'paywall.near/Paywall',
    description: 'Paywall',
    overrides: {
      'mob.near/widget/MainPage.N.Post.Content': 'paywall.near/widget/PaywallDapplet-Content',
    },
  },
  {
    id: 'paywall.near/Zoo',
    description: 'Zoo',
    overrides: {
      'mob.near/widget/N.CommentButton': 'dapplets.near/widget/Cat',
      'mob.near/widget/N.RepostButton': 'dapplets.near/widget/Dog',
      'mob.near/widget/N.LikeButton': 'dapplets.near/widget/N.DislikeButton',
    },
  },
  {
    id: 'nikter.near/Tipping',
    description: 'Tipping',
    overrides: {
      'mob.near/widget/MainPage.N.Post.ShareButton': 'nikter.near/widget/Tipping',
    },
  },
]
