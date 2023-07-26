import axios from 'axios';
import i18next from 'i18next';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import render from './render.js';
import resources from './locales/index.js';
import parser from './utils/parser.js';

const getAllOriginsResponse = (url) => {
  const allOriginsLink = 'https://allorigins.hexlet.app/get';

  const workingUrl = new URL(allOriginsLink);
  workingUrl.searchParams.set('disableCache', 'true');
  workingUrl.searchParams.set('url', url);

  return axios.get(workingUrl);
};

let count = -1;
const takeNewFeedId = (feed) => {
  count += 1;
  feed.id = count;
};
let postsCount = -1;
const takeNewPostId = (post) => {
  postsCount += 1;
  post.id = postsCount;
};

export default async () => {
  setLocale({
    mixed: {
      default: 'default',
      required: 'empty',
      notOneOf: 'alreadyExistsFeedback',
    },
    string: {
      url: 'invalidURLFeedback',
    },
  });
  const initialState = {
    form: {
      error: 'default',
      status: 'filling',
      fields: {
        url: '',
      },
    },
    feeds: [],
    posts: [],
  };

  const i18n = i18next.createInstance();
  await i18n.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const elements = {
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('button[type="submit"]'),
    urlInput: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    example: document.querySelector('.example-url'),
    header: document.querySelector('h1'),
    h2: document.querySelector('.lead'),
    urlLabel: document.querySelector('#urlLabel'),
    feedsColumn: document.querySelector('.feeds'),
    postsColumn: document.querySelector('.posts'),
  };

  const state = onChange(
    initialState,
    render(elements, initialState, i18n),
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const getFeedUrls = initialState.feeds.map((item) => item.link);
    const schema = string()
      .required()
      .url()
      .notOneOf(getFeedUrls);
    state.form.error = '';
    schema.validate(state.form.fields.url)
      .then(() => {
        state.form.status = 'sending';
        return getAllOriginsResponse(state.form.fields.url);
      })
      .then((body) => {
        const parsedContent = parser(body.data.contents);
        const posts = parsedContent.querySelectorAll('item');
        posts.forEach((post) => {
          const title = post.querySelector('title').textContent;
          const description = post.querySelector('description').textContent;
          const link = post.querySelector('link').textContent;
          const somePost = {
            id: 0,
            title,
            description,
            link,
          };
          takeNewPostId(somePost);
          console.log(somePost);
          elements.postsColumn.innerHTML = '';
          state.posts.push(somePost);
        });
        //console.log(posts)
        // console.log(parsedContent.querySelector('title').textContent)
        const feed = {
          id: 0,
          link: state.form.fields.url,
          description: parsedContent.querySelector('title').textContent,
          title: parsedContent.querySelector('description').textContent,
        };
        takeNewFeedId(feed);
        //console.log(parsedContent);
        elements.feedsColumn.innerHTML = '';
        state.feeds.push(feed);
        console.log(getFeedUrls);
        state.form.fields.url = '';
        state.form.error = '';
      })
      .catch((error) => {
        const message = error.message ?? 'default';
        state.form.error = message;
        // console.log(message)
      })
      .finally(() => {
        state.form.status = 'filling';
      });
  });

  elements.urlInput.addEventListener('change', (e) => {
    state.form.fields.url = e.target.value.trim();
  });
};
