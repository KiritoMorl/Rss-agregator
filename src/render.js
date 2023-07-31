const createPosts = (elements, posts, state) => {
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardBodyHeader = document.createElement('h2');
  cardBodyHeader.classList.add('card-title', 'h4');
  cardBodyHeader.textContent = 'Посты';
  cardBody.append(cardBodyHeader);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorder.append(ul);
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start');
    const a = document.createElement('a');
    li.append(a);
    if (state.openedPosts.includes(post.id)) {
      a.outerHTML = `<a href="${post.link}" data-id="${post.id}" class="fw-normal" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
      const button = document.createElement('button');
      li.append(button);
      button.outerHTML = `<button type="button" data-id="${post.id}" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
      ul.prepend(li);
      return;
    }
    a.outerHTML = `<a href="${post.link}" data-id="${post.id}" class="fw-bold" target="_blank" rel="noopener noreferrer">${post.title}</a>`;
    const button = document.createElement('button');
    li.append(button);
    button.outerHTML = `<button type="button" data-id="${post.id}" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal">Просмотр</button>`;
    ul.prepend(li);
  });
  elements.postsColumn.append(cardBorder);
};

const createFeeds = (elements, feeds) => {
  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardBodyHeader = document.createElement('h2');
  cardBodyHeader.classList.add('card-title', 'h4');
  cardBodyHeader.textContent = 'Фиды';
  cardBody.append(cardBodyHeader);
  cardBorder.append(cardBody);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorder.append(ul);
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedHeader = document.createElement('h3');
    feedHeader.classList.add('h6', 'm-0');
    feedHeader.textContent = feed.title;
    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;
    li.append(feedHeader);
    li.append(feedDescription);
    ul.append(li);
  });
  elements.feedsColumn.append(cardBorder);
};

const handleformState = (elements, formState) => {
  if (formState === 'sending') {
    elements.submitButton.disabled = true;
    return;
  }
  elements.submitButton.disabled = false;
};

const inputErrors = (elements, error, i18n) => {
  if (error === '' || error === 'default') {
    elements.urlInput.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.textContent = i18n.t('goodFeedback');
    elements.feedback.classList.add('text-success');
    elements.urlInput.focus();
    // console.log(error)
    return;
  }
  elements.urlInput.classList.add('is-invalid');
  elements.feedback.classList.remove('text-success');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = i18n.t(`${error}`);
  elements.urlInput.focus();
};

export default (elements, state, i18n) => (path, value) => {
  elements.h2.textContent = i18n.t('lead');
  elements.header.textContent = i18n.t('header');
  elements.urlLabel.textContent = i18n.t('urlInput');
  elements.submitButton.textContent = i18n.t('addButton');
  if (path === 'form.status') {
    handleformState(elements, value);
  }
  if (path === 'form.fields.url') {
    elements.urlInput.value = value;
    return;
  }
  if (path === 'form.error') {
    inputErrors(elements, value, i18n);
  }
  if (path === 'feeds') {
    createFeeds(elements, state.feeds);
  }
  if (path === 'posts') {
    createPosts(elements, state.posts, state);
  }
};
