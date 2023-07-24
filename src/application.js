import axios from 'axios';
import i18next from 'i18next';
import onChange from 'on-change';
import { setLocale, string } from 'yup';
import render from './render.js';
import resources from './locales/index.js';


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
      error: '',
      status: 'filling',
      fields: {
        url: '',
      },
    },
    feeds: [],
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
      })
      .then(() => {
        const feed = {
          id: 0,
          link: state.form.fields.url,
        };
        state.feeds.push(feed);
        console.log(getFeedUrls);
        state.form.fields.url = '';
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
