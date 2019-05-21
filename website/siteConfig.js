/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

const siteConfig = {
  title: 'sinoui开发指南', // Title for your website.
  tagline: '基于React和sinoui的应用开发指南',
  url: 'https://sinoui.github.io', // Your website URL
  baseUrl: '/sinoui-guide/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'sinoui-guide',
  organizationName: 'sinoui',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'react-index', label: '基础知识' },
    { doc: 'app-dev-index', label: '应用开发指南' },
    { doc: 'tools-index', label: '前端资源' },
    {
      href: 'https://github.com/sinoui/sinoui-guide',
      label: 'GitHub',
    },
    { page: 'help', label: 'Help' },
  ],

  /* Colors for website */
  colors: {
    primaryColor: '#03a9f4',
    secondaryColor: '#9c27b0',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} sinosoft.com.cn`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'atom-one-dark',
  },

  usePrism: ['jsx'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/undraw_online.svg',
  twitterImage: 'img/undraw_tweetstorm.svg',

  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
    '/sinoui-guide/js/code-block-buttons.js',
  ],
  stylesheets: ['/sinoui-guide/css/code-block-buttons.css'],
  enableUpdateTime: true,
  enableUpdateBy: true,
  docsSideNavCollapsible: true,
  scrollToTop: true,
  scrollToTopOptions: {
    zIndex: 100,
  },

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
