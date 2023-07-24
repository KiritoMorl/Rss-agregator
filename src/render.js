 


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
    
};
